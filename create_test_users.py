#!/usr/bin/env python3
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone
import uuid

# Load environment variables
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def create_test_users():
    print("Creating test users...")
    
    test_users = [
        {
            "id": str(uuid.uuid4()),
            "name": "Super Admin",
            "email": "superadmin@demo.com",
            "hashed_password": get_password_hash("super123"),
            "role": "SuperAdmin",
            "department_id": None,
            "avatar": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "System Admin",
            "email": "admin@demo.com",
            "hashed_password": get_password_hash("admin123"),
            "role": "Admin",
            "department_id": None,
            "avatar": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "name": "John Creator",
            "email": "creator@demo.com",
            "hashed_password": get_password_hash("creator123"),
            "role": "Creator",
            "department_id": "dept-1",
            "avatar": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    for user in test_users:
        # Check if user already exists
        existing = await db.users.find_one({"email": user["email"]})
        if existing:
            print(f"User {user['email']} already exists, skipping...")
            continue
            
        # Insert user
        await db.users.insert_one(user)
        print(f"Created user: {user['email']} ({user['role']})")
    
    print("Test users creation completed!")

async def main():
    try:
        await create_test_users()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())