#!/usr/bin/env python3
"""
Create test users in MongoDB for API testing
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_test_users():
    """Create test users with different roles"""
    
    test_users = [
        {
            "id": str(uuid.uuid4()),
            "name": "Super Administrator",
            "email": "superadmin@planforge.com",
            "password": "SuperAdmin123!",
            "role": "SuperAdmin",
            "department_id": None,
            "avatar": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "System Admin",
            "email": "admin@planforge.com",
            "password": "Admin123!",
            "role": "Admin",
            "department_id": None,
            "avatar": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Content Creator",
            "email": "creator@planforge.com",
            "password": "Creator123!",
            "role": "Creator",
            "department_id": None,
            "avatar": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    for user in test_users:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user["email"]})
        if existing_user:
            print(f"User {user['email']} already exists, skipping...")
            continue
        
        # Hash password
        hashed_password = pwd_context.hash(user["password"])
        user["hashed_password"] = hashed_password
        del user["password"]
        
        # Insert user
        await db.users.insert_one(user)
        print(f"Created user: {user['email']} with role: {user['role']}")
    
    print("Test users creation completed!")

async def main():
    await create_test_users()
    client.close()

if __name__ == "__main__":
    asyncio.run(main())