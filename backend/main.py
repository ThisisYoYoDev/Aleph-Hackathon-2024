from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from aleph.sdk.chains.ethereum import get_fallback_account
from aleph.sdk.client import AuthenticatedAlephHttpClient
from aleph_message.models import StoreMessage, ItemType
import io

CHANNEL = "TEAM-7"
app = FastAPI()

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


# def read_file_bytes(file_path: str) -> bytes:
#     with open(file_path, "rb") as file:
#         return file.read()


# async def main():
#     message, status = await upload_store(read_file_bytes("Katy Perry - I Kissed A Girl.mp3"))
#     print(message.item_hash)


# import asyncio

# if __name__ == "__main__":
#     asyncio.run(main())