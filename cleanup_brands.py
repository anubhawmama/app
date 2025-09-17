#!/usr/bin/env python3
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def cleanup_brands():
    print("Cleaning up incomplete brands...")
    
    # Find brands that don't have the required fields
    incomplete_brands = await db.brands.find({
        "$or": [
            {"short_name": {"$exists": False}},
            {"sap_division_code": {"$exists": False}},
            {"article_type": {"$exists": False}},
            {"merchandise_code": {"$exists": False}}
        ]
    }).to_list(length=None)
    
    print(f"Found {len(incomplete_brands)} incomplete brands")
    
    for brand in incomplete_brands:
        print(f"Deleting incomplete brand: {brand.get('name', 'Unknown')}")
        await db.brands.delete_one({"_id": brand["_id"]})
    
    print("Cleanup completed!")

async def main():
    try:
        await cleanup_brands()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())