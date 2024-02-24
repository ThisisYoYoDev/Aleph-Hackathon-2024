from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from aleph.sdk.chains.ethereum import get_fallback_account
from aleph.sdk.client import AuthenticatedAlephHttpClient
from aleph_message.models import StoreMessage, ItemType
from typing import Optional
import io
import pathlib
import requests
import random


CHANNEL = "TEAM-7"
AGGREGATE_KEY = "VibeDefy"
KEY_PATH = pathlib.Path(__file__).parent / "ethereum.key"

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
async def upload_store(cid: str, filename: str, cid_image: str = None):
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im", allow_unix_sockets=False) as client:
        message, status = await client.create_store(
            file_hash=cid,
            channel=CHANNEL,
            storage_engine="ipfs",
        )

        message_img = None
        if cid_image:
            message_img, _ = await client.create_store(
                file_hash=cid_image,
                channel=CHANNEL,
                storage_engine="ipfs",
            )

        await upload_aggregate({
            filename: {
                'cid': message.content.item_hash,
                'cid_image': cid_image,
                'item_hash': message.item_hash,
                'item_hash_image': message_img.item_hash if message_img else None
            }
        })
    return message, status


@app.get("/download/{item_hash}")
async def get_store(item_hash: str):
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im", allow_unix_sockets=False) as client:
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
async def get_song_list(song_name: Optional[str] = None, song_hash: Optional[str] = None, start: Optional[int] = 0, limit: Optional[int] = 32):
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account,) as client:
        message = await client.fetch_aggregate(account.get_address(), AGGREGATE_KEY)
        message = {k: v for k, v in message.items() if isinstance(v, dict)}

        if song_name:
            filtered_songs = {key: value for key, value in message.items() if song_name.lower() in key.lower()}
            if not filtered_songs:
                raise HTTPException(status_code=404, detail="Song not found")
            paginated_songs = dict(list(filtered_songs.items())[start: start + limit])
            next_token = start + limit if start + limit < len(filtered_songs) else None
        elif song_hash:
            filtered_songs = {key: value for key, value in message.items() if song_hash == value['item_hash']}
            if not filtered_songs:
                raise HTTPException(status_code=404, detail="Song not found")
            paginated_songs = dict(list(filtered_songs.items())[start: start + limit])
            next_token = start + limit if start + limit < len(filtered_songs) else None
        else:
            paginated_songs = dict(list(message.items())[start: start + limit])
            next_token = start + limit if start + limit < len(message) else None
        return {"songs": paginated_songs, "next_token": next_token}

API_URL = "https://curated.aleph.cloud/vm/cb6a4ae6bf93599b646aa54d4639152d6ea73eedc709ca547697c56608101fc7/completion"

promp = """
<|im_start|>system
Hello I will provide you with a list of music you have to give me the next music you can think of corresponds to the same musical taste.
I will provide you with a list of music, and you must send me the next music in the following format: |name='musique_name'|
Your answer must only be one of the following musics:
{MUSIC_LIST}
<|im_end|>
<|im_start|>user
I'm listening to the following music: '{CURRENT_MUSIC}'
<|im_end|>
<|im_start|>assistant
"""

@app.get("/next_music")
async def get_next_music(last_song: str = None):
    if last_song == None:
        raise ValueError("last_song name is required")
    musicss = await get_song_list()
    music_from = []
    for tmp in list(musicss["songs"].keys()):
        if tmp.endswith('.mp3'):
            music_from.append(tmp)
    try:
        music_from.remove(last_song)
    except:
        print('Ok')

    random.shuffle(music_from)
    params = {
        "prompt": promp.format(CURRENT_MUSIC=last_song, MUSIC_LIST="\n".join(music_from)),
        "temperature": 0.1,
        "top_p": 1,
        "top_k": 40,
        "n_predict": 126,
    }
    response = requests.post(API_URL, json=params)

    if response.status_code == 200:
        music_name = response.json()['content'].split('|name=')[1].split("'|")[0]
        for music in music_from:
            if music.startswith(music_name):
                music_name = music
                break
        if music_name not in music_from:
            music_name = music_from[0]
        return {'next_musique': music_name}
    else:
        return None

async def upload_aggregate(content: dict):
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im", allow_unix_sockets=False) as client:
        message, status = await client.create_aggregate(
            key=AGGREGATE_KEY,
            content=content,
            channel=CHANNEL,
        )
    return message, status

@app.delete("/remove_music")
async def remove_music(content_hash: str):
    if not content_hash:
        raise ValueError("content_hash is required")

    key, value = list((await get_song_list(song_hash=content_hash))['songs'].items())[0]

    await upload_aggregate({ key: None })
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im/", allow_unix_sockets=False) as client:
        message, status = await client.forget(
            hashes=[value['item_hash']],
            reason='revoke',
            address=account.get_address(),
            channel=CHANNEL
        )
    return message, status

async def create_post(post_content: dict):
    if not post_content:
        raise ValueError("post_content is required")

    storage_engine = "storage"

    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im", allow_unix_sockets=False) as client:
        message, status = await client.create_post(
            post_type='test',
            post_content=post_content,
            channel=CHANNEL,
            storage_engine=storage_engine,
        )
    return message, status


async def get_post(hash: str):
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im", allow_unix_sockets=False) as client:
        message = await client.get_message(hash)
    return message.json()


async def update_post(post_content: str, hash_content: str):
    if not post_content:
        raise ValueError("post_content is required to update")

    if not hash:
        raise ValueError("hash is required to update a post")

    storage_engine = "storage"
    account = get_fallback_account(path=KEY_PATH)
    async with AuthenticatedAlephHttpClient(account, api_server="https://api2.aleph.im", allow_unix_sockets=False) as client:
        message, status = await client.create_post(
            post_type='test',
            post_content=post_content,
            ref=hash_content,
            channel=CHANNEL,
            storage_engine=storage_engine,
        )
    return message, status
