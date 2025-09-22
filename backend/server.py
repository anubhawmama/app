from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
import aiohttp

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="Admin Dashboard API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    department_id: Optional[str] = None

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    role: str
    department_id: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department_id: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool

# System Metadata Models
class Department(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    code: str
    description: str
    status: str = "Active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str

class DepartmentCreate(BaseModel):
    name: str
    code: str
    description: str

class Brand(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand_id: Optional[str] = None  # User's API field
    name: str
    description: str
    short_name: str  # User's API field
    sap_division_code: str  # User's API field
    article_type: str  # User's API field
    merchandise_code: str  # User's API field
    status: str = "Active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str

class BrandCreate(BaseModel):
    name: str
    description: str
    short_name: str
    sap_division_code: str
    article_type: str
    merchandise_code: str

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    code: str
    description: str
    status: str = "Active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str

class CategoryCreate(BaseModel):
    name: str
    code: str
    description: str

class Subcategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    code: str
    category_id: str
    description: str
    status: str = "Active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str

class SubcategoryCreate(BaseModel):
    name: str
    code: str
    category_id: str
    description: str

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    ean_code: str
    category_id: str
    subcategory_id: str
    brand_id: str
    mrp: float
    status: str = "Active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str

class ProductCreate(BaseModel):
    name: str
    ean_code: str
    category_id: str
    subcategory_id: str
    brand_id: str
    mrp: float

# Plan Management Models
class Plan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    start_date: str
    end_date: str
    status: str = "started"
    description: str
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlanCreate(BaseModel):
    name: str
    start_date: str
    end_date: str
    description: str

class PlanRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plan_id: str
    department_id: str
    status: str = "pending"
    message: str
    requested_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    submitted_at: Optional[datetime] = None
    submitted_by: Optional[str] = None

class PlanRequestCreate(BaseModel):
    plan_id: str
    department_id: str
    message: str

# Planning Data Models
class PlanningData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plan_id: str
    department_id: str
    product_id: str
    planned: float
    actual: float = 0.0
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlanningDataCreate(BaseModel):
    plan_id: str
    department_id: str
    product_id: str
    planned: float

class PlanningDataUpdate(BaseModel):
    planned: Optional[float] = None
    actual: Optional[float] = None
    status: Optional[str] = None

# Notification Models
class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    message: str
    type: str = "info"
    priority: str = "medium"
    department_id: Optional[str] = None
    user_id: Optional[str] = None
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"
    priority: str = "medium"
    department_id: Optional[str] = None
    user_id: Optional[str] = None

# Google OAuth Session Models
class GoogleAuthUser(BaseModel):
    id: str
    email: str
    name: str
    picture: str
    session_token: str

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user_from_session_token(session_token: str):
    """Get user from session token"""
    try:
        # Find active session
        session = await db.sessions.find_one({
            "session_token": session_token,
            "is_active": True,
            "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
        })
        
        if not session:
            return None
            
        # Get user from session
        user = await db.users.find_one({"id": session["user_id"]})
        if not user:
            return None
            
        return UserResponse(**user)
    except Exception as e:
        print(f"Session validation error: {e}")
        return None

async def get_current_user(request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Enhanced authentication that checks both session tokens and JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # First try session token from cookies
    session_token = request.cookies.get("session_token")
    if session_token:
        user = await get_user_from_session_token(session_token)
        if user:
            return user
    
    # Fallback to JWT token from Authorization header
    if not credentials:
        raise credentials_exception
        
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return UserResponse(**user)

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == '_id':
                continue  # Skip MongoDB ObjectId
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            else:
                result[key] = value
        return result
    return doc

# Google OAuth Session Routes
@api_router.post("/auth/process-session")
async def process_google_session(request: Request, response: Response):
    """Process Google OAuth session ID and create user session"""
    try:
        # Get session ID from header
        session_id = request.headers.get("X-Session-ID")
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID required")
        
        # Call Emergent auth service to get user data
        async with aiohttp.ClientSession() as session:
            headers = {"X-Session-ID": session_id}
            async with session.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers=headers
            ) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=400, detail="Invalid session ID")
                
                auth_data = await resp.json()
        
        # Check if user exists, create if not
        existing_user = await db.users.find_one({"email": auth_data["email"]})
        
        if not existing_user:
            # Create new user from Google data
            user_data = {
                "id": str(uuid.uuid4()),
                "name": auth_data["name"],
                "email": auth_data["email"],
                "role": "User",  # Default role for Google sign-in users
                "avatar": auth_data.get("picture"),
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "auth_provider": "google"
            }
            await db.users.insert_one(user_data)
            user = UserResponse(**user_data)
        else:
            # Use existing user (don't update existing data as per playbook)
            user = UserResponse(**existing_user)
        
        # Create session record
        session_expires = datetime.now(timezone.utc) + timedelta(days=7)
        session_data = {
            "id": str(uuid.uuid4()),
            "user_id": user.id,
            "session_token": auth_data["session_token"],
            "expires_at": session_expires.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
        await db.sessions.insert_one(session_data)
        
        # Set secure cookie
        response.set_cookie(
            key="session_token",
            value=auth_data["session_token"],
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        return {
            "success": True,
            "user": user.dict(),
            "message": "Authentication successful"
        }
        
    except Exception as e:
        print(f"Google auth error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response, current_user: UserResponse = Depends(get_current_user)):
    """Logout user and cleanup session"""
    try:
        # Get session token from cookie
        session_token = request.cookies.get("session_token")
        
        if session_token:
            # Deactivate session in database
            await db.sessions.update_one(
                {"session_token": session_token},
                {"$set": {"is_active": False}}
            )
        
        # Clear cookie
        response.delete_cookie(
            key="session_token",
            path="/",
            httponly=True,
            secure=True,
            samesite="none"
        )
        
        return {"success": True, "message": "Logged out successfully"}
        
    except Exception as e:
        print(f"Logout error: {e}")
        return {"success": True, "message": "Logged out successfully"}

@api_router.get("/auth/session-check")
async def check_session(request: Request):
    """Check if user has valid session"""
    try:
        session_token = request.cookies.get("session_token")
        if not session_token:
            return {"authenticated": False}
            
        user = await get_user_from_session_token(session_token)
        if user:
            return {
                "authenticated": True,
                "user": user.dict()
            }
        else:
            return {"authenticated": False}
            
    except Exception as e:
        print(f"Session check error: {e}")
        return {"authenticated": False}
# Traditional Authentication Routes
@api_router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, current_user: UserResponse = Depends(get_current_user)):
    # Only SuperAdmin and Admin can create users
    if current_user.role not in ["SuperAdmin", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    user_dict["id"] = str(uuid.uuid4())
    user_dict["is_active"] = True
    user_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    del user_dict["password"]
    
    await db.users.insert_one(user_dict)
    return UserResponse(**user_dict)

@api_router.get("/auth/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

# User Management Routes
@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["SuperAdmin", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    users = await db.users.find().to_list(length=None)
    return [UserResponse(**serialize_doc(user)) for user in users]

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["SuperAdmin", "Admin"] and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**serialize_doc(user))

# Department Management Routes
@api_router.get("/departments", response_model=List[Department])
async def get_departments(current_user: UserResponse = Depends(get_current_user)):
    departments = await db.departments.find().to_list(length=None)
    return [Department(**serialize_doc(dept)) for dept in departments]

@api_router.post("/departments", response_model=Department)
async def create_department(department: DepartmentCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    dept_dict = department.dict()
    dept_dict["id"] = str(uuid.uuid4())
    dept_dict["created_by"] = current_user.id
    dept_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.departments.insert_one(dept_dict)
    return Department(**dept_dict)

@api_router.put("/departments/{department_id}", response_model=Department)
async def update_department(department_id: str, department: DepartmentCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing_dept = await db.departments.find_one({"id": department_id})
    if not existing_dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    update_data = department.dict()
    await db.departments.update_one({"id": department_id}, {"$set": update_data})
    
    updated_dept = await db.departments.find_one({"id": department_id})
    return Department(**serialize_doc(updated_dept))

@api_router.delete("/departments/{department_id}")
async def delete_department(department_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    result = await db.departments.delete_one({"id": department_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department deleted successfully"}

# Brand Management Routes
@api_router.get("/brands", response_model=List[Brand])
async def get_brands(current_user: UserResponse = Depends(get_current_user)):
    brands = await db.brands.find().to_list(length=None)
    return [Brand(**serialize_doc(brand)) for brand in brands]

@api_router.post("/brands", response_model=Brand)
async def create_brand(brand: BrandCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    brand_dict = brand.dict()
    brand_id = str(uuid.uuid4())
    brand_dict["id"] = brand_id
    brand_dict["brand_id"] = brand_id  # Set brand_id same as id for API compatibility
    brand_dict["created_by"] = current_user.id
    brand_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.brands.insert_one(brand_dict)
    return Brand(**brand_dict)

@api_router.put("/brands/{brand_id}", response_model=Brand)
async def update_brand(brand_id: str, brand: BrandCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    existing_brand = await db.brands.find_one({"id": brand_id})
    if not existing_brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    update_data = brand.dict()
    await db.brands.update_one({"id": brand_id}, {"$set": update_data})
    
    updated_brand = await db.brands.find_one({"id": brand_id})
    return Brand(**serialize_doc(updated_brand))

@api_router.delete("/brands/{brand_id}")
async def delete_brand(brand_id: str, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    result = await db.brands.delete_one({"id": brand_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Brand not found")
    return {"message": "Brand deleted successfully"}

# Category Management Routes
@api_router.get("/categories", response_model=List[Category])
async def get_categories(current_user: UserResponse = Depends(get_current_user)):
    categories = await db.categories.find().to_list(length=None)
    return [Category(**serialize_doc(cat)) for cat in categories]

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    cat_dict = category.dict()
    cat_dict["id"] = str(uuid.uuid4())
    cat_dict["created_by"] = current_user.id
    cat_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.categories.insert_one(cat_dict)
    return Category(**cat_dict)

# Subcategory Management Routes
@api_router.get("/subcategories", response_model=List[Subcategory])
async def get_subcategories(current_user: UserResponse = Depends(get_current_user)):
    subcategories = await db.subcategories.find().to_list(length=None)
    return [Subcategory(**serialize_doc(subcat)) for subcat in subcategories]

@api_router.post("/subcategories", response_model=Subcategory)
async def create_subcategory(subcategory: SubcategoryCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role != "SuperAdmin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    subcat_dict = subcategory.dict()
    subcat_dict["id"] = str(uuid.uuid4())
    subcat_dict["created_by"] = current_user.id
    subcat_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.subcategories.insert_one(subcat_dict)
    return Subcategory(**subcat_dict)

# Product Management Routes
@api_router.get("/products", response_model=List[Product])
async def get_products(current_user: UserResponse = Depends(get_current_user)):
    products = await db.products.find().to_list(length=None)
    return [Product(**serialize_doc(prod)) for prod in products]

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["SuperAdmin", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    prod_dict = product.dict()
    prod_dict["id"] = str(uuid.uuid4())
    prod_dict["created_by"] = current_user.id
    prod_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.products.insert_one(prod_dict)
    return Product(**prod_dict)

# Plan Management Routes
@api_router.get("/plans", response_model=List[Plan])
async def get_plans(current_user: UserResponse = Depends(get_current_user)):
    plans = await db.plans.find().to_list(length=None)
    return [Plan(**serialize_doc(plan)) for plan in plans]

@api_router.post("/plans", response_model=Plan)
async def create_plan(plan: PlanCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["SuperAdmin", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    plan_dict = plan.dict()
    plan_dict["id"] = str(uuid.uuid4())
    plan_dict["created_by"] = current_user.id
    plan_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.plans.insert_one(plan_dict)
    return Plan(**plan_dict)

# Planning Data Routes
@api_router.get("/planning-data", response_model=List[PlanningData])
async def get_planning_data(plan_id: Optional[str] = None, department_id: Optional[str] = None, current_user: UserResponse = Depends(get_current_user)):
    query = {}
    if plan_id:
        query["plan_id"] = plan_id
    if department_id:
        query["department_id"] = department_id
    
    # Role-based filtering
    if current_user.role in ["Creator", "Approver", "User"] and current_user.department_id:
        query["department_id"] = current_user.department_id
    
    planning_data = await db.planning_data.find(query).to_list(length=None)
    return [PlanningData(**serialize_doc(data)) for data in planning_data]

@api_router.post("/planning-data", response_model=PlanningData)
async def create_planning_data(planning_data: PlanningDataCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["SuperAdmin", "Admin", "Creator"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Check if user has access to this department
    if current_user.role == "Creator" and current_user.department_id != planning_data.department_id:
        raise HTTPException(status_code=403, detail="Access denied to this department")
    
    data_dict = planning_data.dict()
    data_dict["id"] = str(uuid.uuid4())
    data_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    data_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.planning_data.insert_one(data_dict)
    return PlanningData(**data_dict)

@api_router.put("/planning-data/{data_id}", response_model=PlanningData)
async def update_planning_data(data_id: str, update_data: PlanningDataUpdate, current_user: UserResponse = Depends(get_current_user)):
    existing_data = await db.planning_data.find_one({"id": data_id})
    if not existing_data:
        raise HTTPException(status_code=404, detail="Planning data not found")
    
    # Check permissions
    if current_user.role == "Creator" and current_user.department_id != existing_data["department_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.planning_data.update_one({"id": data_id}, {"$set": update_dict})
    
    updated_data = await db.planning_data.find_one({"id": data_id})
    return PlanningData(**serialize_doc(updated_data))

# Notification Routes
@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: UserResponse = Depends(get_current_user)):
    query = {}
    if current_user.role not in ["SuperAdmin", "Admin"]:
        query = {
            "$or": [
                {"user_id": current_user.id},
                {"department_id": current_user.department_id},
                {"user_id": None, "department_id": None}
            ]
        }
    
    notifications = await db.notifications.find(query).sort("created_at", -1).to_list(length=None)
    return [Notification(**serialize_doc(notif)) for notif in notifications]

@api_router.post("/notifications", response_model=Notification)
async def create_notification(notification: NotificationCreate, current_user: UserResponse = Depends(get_current_user)):
    if current_user.role not in ["SuperAdmin", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    notif_dict = notification.dict()
    notif_dict["id"] = str(uuid.uuid4())
    notif_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.notifications.insert_one(notif_dict)
    return Notification(**notif_dict)

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Legacy status check endpoints
@api_router.get("/")
async def root():
    return {"message": "Admin Dashboard API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()