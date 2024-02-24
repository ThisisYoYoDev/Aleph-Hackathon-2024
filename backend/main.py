from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from aleph.sdk.chains.ethereum import get_fallback_account
from aleph.sdk.client import AuthenticatedAlephHttpClient
from aleph_message.models import StoreMessage, ItemType
from typing import Optional
import io

CHANNEL = "TEAM-7"
AGGREGATE_KEY = "VibeDefy"

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_store(file: UploadFile = File(...)):
    contents = file.file.read()
    storage_engine = "storage"
    if len(contents) > 2 * 1024 * 1024:
         storage_engine = "ipfs"

    account = get_fallback_account()
    async with AuthenticatedAlephHttpClient(account) as client:
        message, status = await client.create_store(
            file_content=contents,
            channel=CHANNEL,
            storage_engine=storage_engine,
        )
        await upload_aggregate({
            file.filename: {
                'cid': message.content.item_hash,
                'item_hash': message.item_hash
            }
        })
    return message, status


@app.get("/download/{item_hash}")
async def get_store(item_hash: str):
    account = get_fallback_account()
    async with AuthenticatedAlephHttpClient(account) as client:
        message = await client.get_message(item_hash, StoreMessage)
        buffer = io.BytesIO()
        if message.content.item_type == ItemType.storage:
            await client.download_file_to_buffer(message.content.item_hash, output_buffer=buffer)
            buffer.seek(0)
            return StreamingResponse(buffer, media_type="audio/mpeg")
        elif message.content.item_type == ItemType.ipfs:
            await client.download_file_ipfs_to_buffer(message.content.item_hash, output_buffer=buffer)
            buffer.seek(0)
            return StreamingResponse(buffer, media_type="audio/mpeg")
        else:
            return HTTPException(status_code=404, detail="Item not found")


@app.get("/song_list")
async def get_song_list(song_name: Optional[str] = None, start: Optional[int] = 0, limit: Optional[int] = 32):
    account = get_fallback_account()
    async with AuthenticatedAlephHttpClient(account) as client:
        message = await client.fetch_aggregate(account.get_address(), AGGREGATE_KEY)
        if song_name:
            filtered_songs = {key: value for key, value in message.items() if song_name.lower() in key.lower()}
            if not filtered_songs:
                raise HTTPException(status_code=404, detail="Song not found")
            paginated_songs = dict(list(filtered_songs.items())[start: start + limit])
            next_token = start + limit if start + limit < len(filtered_songs) else None
        else:
            paginated_songs = dict(list(message.items())[start: start + limit])
            next_token = start + limit if start + limit < len(message) else None
        return {"songs": paginated_songs, "next_token": next_token}


async def upload_aggregate(content: dict):
    account = get_fallback_account()
    async with AuthenticatedAlephHttpClient(account) as client:
        message, status = await client.create_aggregate(
            key=AGGREGATE_KEY,
            content=content,
            channel=CHANNEL,
        )
    return message, status




# def read_file_bytes(file_path: str) -> bytes:
#     with open(file_path, "rb") as file:
#         return file.read()
# async def main():
#     message, status = await upload_aggregate({'age': None})
#     print(message, status)
#     message = await download_aggregate(AGGREGATE_KEY)
#     print(message)
#     message, status = await upload_store(read_file_bytes("Katy Perry - I Kissed A Girl.mp3"))
#     print(message.item_hash)


# import asyncio

# if __name__ == "__main__":
#     asyncio.run(main())