#!/usr/bin/env python3
"""
Comprehensive Backend API Testing Suite
Tests all admin dashboard backend endpoints with role-based access control
"""

import requests
import json
import uuid
from datetime import datetime, timezone
import sys
import time

# Configuration
BASE_URL = "https://planwise-admin.preview.emergentagent.com/api"
TIMEOUT = 30

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.tokens = {}
        self.test_data = {}
        self.results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def test_health_check(self):
        """Test the health endpoint"""
        self.log("Testing health check endpoint...")
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log("✅ Health check passed")
                    self.results['passed'] += 1
                    return True
                else:
                    self.log("❌ Health check failed - invalid response format")
                    self.results['failed'] += 1
                    self.results['errors'].append("Health check: Invalid response format")
                    return False
            else:
                self.log(f"❌ Health check failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Health check: HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log(f"❌ Health check failed - Error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Health check: {str(e)}")
            return False
    
    def create_test_superadmin(self):
        """Create a test superadmin user directly in the system"""
        self.log("Creating test SuperAdmin user...")
        
        # First, we need to create a superadmin user manually since registration requires auth
        # We'll try to login first to see if one exists
        test_credentials = {
            "email": "superadmin@planforge.com",
            "password": "SuperAdmin123!"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/auth/login", json=test_credentials)
            if response.status_code == 200:
                token_data = response.json()
                self.tokens['superadmin'] = token_data['access_token']
                self.log("✅ SuperAdmin login successful")
                return True
            else:
                self.log("SuperAdmin doesn't exist, need to create one manually")
                # For testing purposes, we'll assume a superadmin exists or create via direct DB
                return False
        except Exception as e:
            self.log(f"❌ SuperAdmin creation failed: {str(e)}")
            return False
    
    def test_authentication_system(self):
        """Test authentication endpoints"""
        self.log("Testing Authentication System...")
        
        # Test 1: Login with invalid credentials
        try:
            invalid_creds = {
                "email": "invalid@test.com",
                "password": "wrongpassword"
            }
            response = self.session.post(f"{self.base_url}/auth/login", json=invalid_creds)
            if response.status_code == 401:
                self.log("✅ Invalid login correctly rejected")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Invalid login test failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Auth: Invalid login should return 401, got {response.status_code}")
        except Exception as e:
            self.log(f"❌ Invalid login test error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Auth invalid login: {str(e)}")
        
        # Test 2: Try to access protected endpoint without token
        try:
            response = self.session.get(f"{self.base_url}/auth/me")
            if response.status_code == 401 or response.status_code == 403:
                self.log("✅ Protected endpoint correctly requires authentication")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Protected endpoint test failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Auth: Protected endpoint should require auth, got {response.status_code}")
        except Exception as e:
            self.log(f"❌ Protected endpoint test error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Auth protected endpoint: {str(e)}")
        
        # Test 3: Session check endpoint without session
        try:
            response = self.session.get(f"{self.base_url}/auth/session-check")
            if response.status_code == 200:
                data = response.json()
                if data.get("authenticated") == False:
                    self.log("✅ Session check correctly returns unauthenticated")
                    self.results['passed'] += 1
                else:
                    self.log("❌ Session check should return authenticated: false")
                    self.results['failed'] += 1
                    self.results['errors'].append("Auth: Session check should return authenticated: false")
            else:
                self.log(f"❌ Session check failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Auth: Session check failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Session check test error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Auth session check: {str(e)}")
        
        # Test 4: Create a test user for further testing
        self.create_test_users()
    
    def create_test_users(self):
        """Create test users with different roles"""
        self.log("Creating test users...")
        
        # Use the test users provided in the review request
        test_users = [
            {
                "name": "Super Administrator",
                "email": "superadmin@demo.com", 
                "password": "super123",
                "role": "SuperAdmin"
            },
            {
                "name": "System Admin",
                "email": "admin@demo.com",
                "password": "admin123",
                "role": "Admin"
            },
            {
                "name": "Content Creator",
                "email": "creator@demo.com", 
                "password": "creator123",
                "role": "Creator"
            }
        ]
        
        # Try to login with each user to see if they exist
        for user in test_users:
            try:
                login_data = {
                    "email": user["email"],
                    "password": user["password"]
                }
                response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
                if response.status_code == 200:
                    token_data = response.json()
                    role_key = user["role"].lower()
                    self.tokens[role_key] = token_data['access_token']
                    self.log(f"✅ {user['role']} user login successful")
                    self.results['passed'] += 1
                else:
                    self.log(f"❌ {user['role']} user login failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Auth: {user['role']} login failed with status {response.status_code}")
            except Exception as e:
                self.log(f"❌ {user['role']} user login error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Auth {user['role']} login: {str(e)}")
    
    def get_auth_headers(self, role='superadmin'):
        """Get authorization headers for a specific role"""
        token = self.tokens.get(role)
        if token:
            return {"Authorization": f"Bearer {token}"}
        return {}
    
    def test_user_management(self):
        """Test user management endpoints"""
        self.log("Testing User Management APIs...")
        
        # Test 1: Get current user info
        headers = self.get_auth_headers('superadmin')
        if headers:
            try:
                response = self.session.get(f"{self.base_url}/auth/me", headers=headers)
                if response.status_code == 200:
                    user_data = response.json()
                    if 'id' in user_data and 'email' in user_data:
                        self.log("✅ Get current user info successful")
                        self.results['passed'] += 1
                    else:
                        self.log("❌ Get current user - invalid response format")
                        self.results['failed'] += 1
                        self.results['errors'].append("User management: Invalid user info response")
                else:
                    self.log(f"❌ Get current user failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"User management: Get current user failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Get current user error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"User management get current: {str(e)}")
        
        # Test 2: List all users (admin only)
        if headers:
            try:
                response = self.session.get(f"{self.base_url}/users", headers=headers)
                if response.status_code == 200:
                    users = response.json()
                    if isinstance(users, list):
                        self.log(f"✅ List users successful - Found {len(users)} users")
                        self.results['passed'] += 1
                    else:
                        self.log("❌ List users - invalid response format")
                        self.results['failed'] += 1
                        self.results['errors'].append("User management: Invalid users list response")
                else:
                    self.log(f"❌ List users failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"User management: List users failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ List users error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"User management list users: {str(e)}")
    
    def test_department_management(self):
        """Test department management endpoints"""
        self.log("Testing Department Management APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for department tests")
            self.results['failed'] += 1
            self.results['errors'].append("Department: No SuperAdmin authentication")
            return
        
        # Test 1: Get departments
        try:
            response = self.session.get(f"{self.base_url}/departments", headers=headers)
            if response.status_code == 200:
                departments = response.json()
                self.log(f"✅ Get departments successful - Found {len(departments)} departments")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get departments failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Department: Get departments failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get departments error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Department get: {str(e)}")
        
        # Test 2: Create department
        test_dept = {
            "name": "Test Department",
            "code": f"TEST_{uuid.uuid4().hex[:8].upper()}",
            "description": "Test department for API testing"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/departments", json=test_dept, headers=headers)
            if response.status_code == 200:
                dept_data = response.json()
                if 'id' in dept_data:
                    self.test_data['department_id'] = dept_data['id']
                    self.log("✅ Create department successful")
                    self.results['passed'] += 1
                else:
                    self.log("❌ Create department - invalid response format")
                    self.results['failed'] += 1
                    self.results['errors'].append("Department: Invalid create response")
            else:
                self.log(f"❌ Create department failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Department: Create failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Create department error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Department create: {str(e)}")
        
        # Test 3: Update department
        if 'department_id' in self.test_data:
            update_data = {
                "name": "Updated Test Department",
                "code": test_dept["code"],
                "description": "Updated description"
            }
            try:
                response = self.session.put(f"{self.base_url}/departments/{self.test_data['department_id']}", 
                                          json=update_data, headers=headers)
                if response.status_code == 200:
                    self.log("✅ Update department successful")
                    self.results['passed'] += 1
                else:
                    self.log(f"❌ Update department failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Department: Update failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Update department error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Department update: {str(e)}")
    
    def test_brand_management(self):
        """Test brand management endpoints"""
        self.log("Testing Brand Management APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for brand tests")
            self.results['failed'] += 1
            self.results['errors'].append("Brand: No SuperAdmin authentication")
            return
        
        # Test 1: Get brands
        try:
            response = self.session.get(f"{self.base_url}/brands", headers=headers)
            if response.status_code == 200:
                brands = response.json()
                self.log(f"✅ Get brands successful - Found {len(brands)} brands")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get brands failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Brand: Get brands failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get brands error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Brand get: {str(e)}")
        
        # Test 2: Create brand
        test_brand = {
            "name": "Test Brand",
            "code": f"TB_{uuid.uuid4().hex[:8].upper()}",
            "description": "Test brand for API testing"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/brands", json=test_brand, headers=headers)
            if response.status_code == 200:
                brand_data = response.json()
                if 'id' in brand_data:
                    self.test_data['brand_id'] = brand_data['id']
                    self.log("✅ Create brand successful")
                    self.results['passed'] += 1
                else:
                    self.log("❌ Create brand - invalid response format")
                    self.results['failed'] += 1
                    self.results['errors'].append("Brand: Invalid create response")
            else:
                self.log(f"❌ Create brand failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Brand: Create failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Create brand error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Brand create: {str(e)}")
    
    def test_category_management(self):
        """Test category and subcategory management endpoints"""
        self.log("Testing Category & Subcategory Management APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for category tests")
            self.results['failed'] += 1
            self.results['errors'].append("Category: No SuperAdmin authentication")
            return
        
        # Test 1: Get categories
        try:
            response = self.session.get(f"{self.base_url}/categories", headers=headers)
            if response.status_code == 200:
                categories = response.json()
                self.log(f"✅ Get categories successful - Found {len(categories)} categories")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get categories failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Category: Get categories failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get categories error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Category get: {str(e)}")
        
        # Test 2: Create category
        test_category = {
            "name": "Test Category",
            "code": f"TC_{uuid.uuid4().hex[:8].upper()}",
            "description": "Test category for API testing"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/categories", json=test_category, headers=headers)
            if response.status_code == 200:
                category_data = response.json()
                if 'id' in category_data:
                    self.test_data['category_id'] = category_data['id']
                    self.log("✅ Create category successful")
                    self.results['passed'] += 1
                else:
                    self.log("❌ Create category - invalid response format")
                    self.results['failed'] += 1
                    self.results['errors'].append("Category: Invalid create response")
            else:
                self.log(f"❌ Create category failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Category: Create failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Create category error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Category create: {str(e)}")
        
        # Test 3: Get subcategories
        try:
            response = self.session.get(f"{self.base_url}/subcategories", headers=headers)
            if response.status_code == 200:
                subcategories = response.json()
                self.log(f"✅ Get subcategories successful - Found {len(subcategories)} subcategories")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get subcategories failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Subcategory: Get subcategories failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get subcategories error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Subcategory get: {str(e)}")
        
        # Test 4: Create subcategory
        if 'category_id' in self.test_data:
            test_subcategory = {
                "name": "Test Subcategory",
                "code": f"TSC_{uuid.uuid4().hex[:8].upper()}",
                "category_id": self.test_data['category_id'],
                "description": "Test subcategory for API testing"
            }
            
            try:
                response = self.session.post(f"{self.base_url}/subcategories", json=test_subcategory, headers=headers)
                if response.status_code == 200:
                    subcategory_data = response.json()
                    if 'id' in subcategory_data:
                        self.test_data['subcategory_id'] = subcategory_data['id']
                        self.log("✅ Create subcategory successful")
                        self.results['passed'] += 1
                    else:
                        self.log("❌ Create subcategory - invalid response format")
                        self.results['failed'] += 1
                        self.results['errors'].append("Subcategory: Invalid create response")
                else:
                    self.log(f"❌ Create subcategory failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Subcategory: Create failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Create subcategory error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Subcategory create: {str(e)}")
    
    def test_product_management(self):
        """Test product management endpoints"""
        self.log("Testing Product Management APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for product tests")
            self.results['failed'] += 1
            self.results['errors'].append("Product: No SuperAdmin authentication")
            return
        
        # Test 1: Get products
        try:
            response = self.session.get(f"{self.base_url}/products", headers=headers)
            if response.status_code == 200:
                products = response.json()
                self.log(f"✅ Get products successful - Found {len(products)} products")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get products failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Product: Get products failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get products error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Product get: {str(e)}")
        
        # Test 2: Create product (requires category, subcategory, and brand)
        if all(key in self.test_data for key in ['category_id', 'subcategory_id', 'brand_id']):
            test_product = {
                "name": "Test Product",
                "ean_code": f"123456789{uuid.uuid4().hex[:4]}",
                "category_id": self.test_data['category_id'],
                "subcategory_id": self.test_data['subcategory_id'],
                "brand_id": self.test_data['brand_id'],
                "mrp": 99.99
            }
            
            try:
                response = self.session.post(f"{self.base_url}/products", json=test_product, headers=headers)
                if response.status_code == 200:
                    product_data = response.json()
                    if 'id' in product_data:
                        self.test_data['product_id'] = product_data['id']
                        self.log("✅ Create product successful")
                        self.results['passed'] += 1
                    else:
                        self.log("❌ Create product - invalid response format")
                        self.results['failed'] += 1
                        self.results['errors'].append("Product: Invalid create response")
                else:
                    self.log(f"❌ Create product failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Product: Create failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Create product error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Product create: {str(e)}")
        else:
            self.log("⚠️ Skipping product creation - missing required dependencies")
    
    def test_plan_management(self):
        """Test plan management endpoints"""
        self.log("Testing Plan Management APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for plan tests")
            self.results['failed'] += 1
            self.results['errors'].append("Plan: No SuperAdmin authentication")
            return
        
        # Test 1: Get plans
        try:
            response = self.session.get(f"{self.base_url}/plans", headers=headers)
            if response.status_code == 200:
                plans = response.json()
                self.log(f"✅ Get plans successful - Found {len(plans)} plans")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get plans failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Plan: Get plans failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get plans error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Plan get: {str(e)}")
        
        # Test 2: Create plan
        test_plan = {
            "name": "Test Plan 2024",
            "start_date": "2024-01-01",
            "end_date": "2024-12-31",
            "description": "Test plan for API testing"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/plans", json=test_plan, headers=headers)
            if response.status_code == 200:
                plan_data = response.json()
                if 'id' in plan_data:
                    self.test_data['plan_id'] = plan_data['id']
                    self.log("✅ Create plan successful")
                    self.results['passed'] += 1
                else:
                    self.log("❌ Create plan - invalid response format")
                    self.results['failed'] += 1
                    self.results['errors'].append("Plan: Invalid create response")
            else:
                self.log(f"❌ Create plan failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Plan: Create failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Create plan error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Plan create: {str(e)}")
    
    def test_planning_data_management(self):
        """Test planning data management endpoints"""
        self.log("Testing Planning Data Management APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for planning data tests")
            self.results['failed'] += 1
            self.results['errors'].append("Planning Data: No SuperAdmin authentication")
            return
        
        # Test 1: Get planning data
        try:
            response = self.session.get(f"{self.base_url}/planning-data", headers=headers)
            if response.status_code == 200:
                planning_data = response.json()
                self.log(f"✅ Get planning data successful - Found {len(planning_data)} records")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get planning data failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Planning Data: Get failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get planning data error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Planning Data get: {str(e)}")
        
        # Test 2: Create planning data (requires plan, department, and product)
        if all(key in self.test_data for key in ['plan_id', 'department_id', 'product_id']):
            test_planning_data = {
                "plan_id": self.test_data['plan_id'],
                "department_id": self.test_data['department_id'],
                "product_id": self.test_data['product_id'],
                "planned": 1000.0
            }
            
            try:
                response = self.session.post(f"{self.base_url}/planning-data", json=test_planning_data, headers=headers)
                if response.status_code == 200:
                    planning_data = response.json()
                    if 'id' in planning_data:
                        self.test_data['planning_data_id'] = planning_data['id']
                        self.log("✅ Create planning data successful")
                        self.results['passed'] += 1
                    else:
                        self.log("❌ Create planning data - invalid response format")
                        self.results['failed'] += 1
                        self.results['errors'].append("Planning Data: Invalid create response")
                else:
                    self.log(f"❌ Create planning data failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Planning Data: Create failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Create planning data error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Planning Data create: {str(e)}")
        else:
            self.log("⚠️ Skipping planning data creation - missing required dependencies")
        
        # Test 3: Update planning data
        if 'planning_data_id' in self.test_data:
            update_data = {
                "actual": 850.0,
                "status": "completed"
            }
            try:
                response = self.session.put(f"{self.base_url}/planning-data/{self.test_data['planning_data_id']}", 
                                          json=update_data, headers=headers)
                if response.status_code == 200:
                    self.log("✅ Update planning data successful")
                    self.results['passed'] += 1
                else:
                    self.log(f"❌ Update planning data failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Planning Data: Update failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Update planning data error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Planning Data update: {str(e)}")
    
    def test_notification_system(self):
        """Test notification system endpoints"""
        self.log("Testing Notification System APIs...")
        
        headers = self.get_auth_headers('superadmin')
        if not headers:
            self.log("❌ No SuperAdmin token available for notification tests")
            self.results['failed'] += 1
            self.results['errors'].append("Notification: No SuperAdmin authentication")
            return
        
        # Test 1: Get notifications
        try:
            response = self.session.get(f"{self.base_url}/notifications", headers=headers)
            if response.status_code == 200:
                notifications = response.json()
                self.log(f"✅ Get notifications successful - Found {len(notifications)} notifications")
                self.results['passed'] += 1
            else:
                self.log(f"❌ Get notifications failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Notification: Get failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Get notifications error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Notification get: {str(e)}")
        
        # Test 2: Create notification
        test_notification = {
            "title": "Test Notification",
            "message": "This is a test notification for API testing",
            "type": "info",
            "priority": "medium"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/notifications", json=test_notification, headers=headers)
            if response.status_code == 200:
                notification_data = response.json()
                if 'id' in notification_data:
                    self.log("✅ Create notification successful")
                    self.results['passed'] += 1
                else:
                    self.log("❌ Create notification - invalid response format")
                    self.results['failed'] += 1
                    self.results['errors'].append("Notification: Invalid create response")
            else:
                self.log(f"❌ Create notification failed - Status: {response.status_code}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Notification: Create failed {response.status_code}")
        except Exception as e:
            self.log(f"❌ Create notification error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"Notification create: {str(e)}")
    
    def test_logout_endpoint(self):
        """Test logout endpoint"""
        self.log("Testing Logout Endpoint...")
        
        # Test logout with valid token
        headers = self.get_auth_headers('admin')
        if headers:
            try:
                response = self.session.post(f"{self.base_url}/auth/logout", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") == True:
                        self.log("✅ Logout endpoint working correctly")
                        self.results['passed'] += 1
                    else:
                        self.log("❌ Logout endpoint - invalid response format")
                        self.results['failed'] += 1
                        self.results['errors'].append("Auth: Logout invalid response format")
                else:
                    self.log(f"❌ Logout endpoint failed - Status: {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"Auth: Logout failed {response.status_code}")
            except Exception as e:
                self.log(f"❌ Logout endpoint error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"Auth logout: {str(e)}")
        else:
            self.log("⚠️ Skipping logout test - no admin token available")
    
    def test_cors_headers(self):
        """Test CORS headers for localhost:3000 origin"""
        self.log("Testing CORS Headers...")
        
        try:
            # Test preflight request
            headers = {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
            response = self.session.options(f"{self.base_url}/auth/login", headers=headers)
            
            # Check CORS headers in response
            cors_headers = response.headers
            if 'Access-Control-Allow-Origin' in cors_headers:
                origin = cors_headers.get('Access-Control-Allow-Origin')
                if origin == '*' or origin == 'http://localhost:3000':
                    self.log("✅ CORS headers correctly configured")
                    self.results['passed'] += 1
                else:
                    self.log(f"❌ CORS origin incorrect: {origin}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"CORS: Incorrect origin {origin}")
            else:
                self.log("❌ CORS headers missing")
                self.results['failed'] += 1
                self.results['errors'].append("CORS: Access-Control-Allow-Origin header missing")
        except Exception as e:
            self.log(f"❌ CORS test error: {str(e)}")
            self.results['failed'] += 1
            self.results['errors'].append(f"CORS test: {str(e)}")
    
    def test_role_based_access_control(self):
        """Test role-based access control"""
        self.log("Testing Role-based Access Control...")
        
        # Test with Creator role trying to access SuperAdmin endpoints
        creator_headers = self.get_auth_headers('creator')
        if creator_headers:
            try:
                # Creator should not be able to create departments
                test_dept = {
                    "name": "Unauthorized Department",
                    "code": "UNAUTH",
                    "description": "Should not be created"
                }
                response = self.session.post(f"{self.base_url}/departments", json=test_dept, headers=creator_headers)
                if response.status_code == 403:
                    self.log("✅ Role-based access control working - Creator correctly denied department creation")
                    self.results['passed'] += 1
                else:
                    self.log(f"❌ Role-based access control failed - Creator should be denied, got {response.status_code}")
                    self.results['failed'] += 1
                    self.results['errors'].append(f"RBAC: Creator should be denied department creation, got {response.status_code}")
            except Exception as e:
                self.log(f"❌ Role-based access control test error: {str(e)}")
                self.results['failed'] += 1
                self.results['errors'].append(f"RBAC test: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        self.log("Starting comprehensive backend API testing...")
        self.log(f"Testing against: {self.base_url}")
        
        # Run tests in order
        self.test_health_check()
        self.test_authentication_system()
        self.test_user_management()
        self.test_department_management()
        self.test_brand_management()
        self.test_category_management()
        self.test_product_management()
        self.test_plan_management()
        self.test_planning_data_management()
        self.test_notification_system()
        self.test_role_based_access_control()
        
        # Print summary
        self.log("\n" + "="*60)
        self.log("BACKEND API TESTING SUMMARY")
        self.log("="*60)
        self.log(f"Total Tests Passed: {self.results['passed']}")
        self.log(f"Total Tests Failed: {self.results['failed']}")
        self.log(f"Success Rate: {(self.results['passed'] / (self.results['passed'] + self.results['failed']) * 100):.1f}%")
        
        if self.results['errors']:
            self.log("\nERRORS ENCOUNTERED:")
            for i, error in enumerate(self.results['errors'], 1):
                self.log(f"{i}. {error}")
        
        return self.results

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if results['failed'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)