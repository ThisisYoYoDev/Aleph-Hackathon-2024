from fastapi import FastAPI
from aleph.sdk.chains.ethereum import get_fallback_account
from aleph.sdk.client import AuthenticatedAlephHttpClient
from aleph_message.models import StoreMessage, ItemType
import json

CHANNEL = "TEAM-7"

# app = FastAPI()

# @app.get("/")
# def read_root():
#     return {"Toni": "Le Gros LARD"}


async def upload_store(file_content: bytes):
    if not file_content:
        raise ValueError("file_content is required")

    storage_engine = "storage"

    if len(file_content) > 2 * 1024 * 1024:
         storage_engine = "ipfs"
    account = get_fallback_account()
    async with AuthenticatedAlephHttpClient(account) as client:
        message, status = await client.create_store(
            file_content=file_content,
            channel=CHANNEL,
            storage_engine=storage_engine,
        )
    return message, status

async def get_store(item_hash: str) -> bytes:
    account = get_fallback_account()
    async with AuthenticatedAlephHttpClient(account) as client:
        message = await client.get_message(item_hash, StoreMessage)
        if message.content.item_type == ItemType.storage:
            data = await client.download_file(message.content.item_hash)
        elif message.content.item_type == ItemType.ipfs:
            data = await client.download_file_ipfs(message.content.item_hash)
        else:
            print("Not recognized storage type")
    return data

async def main():
    message, status = await upload_store(b"Hello, World!")
    data = await get_store(message.item_hash)
    print(data)


import asyncio

if __name__ == "__main__":
    asyncio.run(main())