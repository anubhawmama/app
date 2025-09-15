# API Contracts & Integration Plan

## Overview
This document outlines the API contracts and integration plan for converting the admin dashboard from mock data to full backend integration.

## Current Mock Data Usage

### 1. Authentication
**Mock Location**: `mockUsers` in `mockData.js`
**Current Implementation**: LocalStorage-based authentication
**Data Structure**:
```javascript
{
  id: number,
  name: string,
  email: string,
  password: string,
  role: string,
  avatar: string
}
```

### 2. User Management 
**Mock Location**: `mockTableData` in `mockData.js`
**Current Implementation**: In-memory state management
**Data Structure**:
```javascript
{
  id: number,
  name: string,
  email: string,
  role: string,
  status: string,
  lastLogin: string,
  avatar: string
}
```

### 3. Dashboard Statistics
**Mock Location**: `mockDashboardData` in `mockData.js`
**Current Implementation**: Static data display
**Data Structure**:
```javascript
{
  stats: [{
    title: string,
    value: string,
    change: string
  }]
}
```

### 4. Notifications
**Mock Location**: `mockNotifications` in `mockData.js`
**Current Implementation**: Static notifications with local filtering
**Data Structure**:
```javascript
{
  id: number,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  timestamp: string,
  read: boolean
}
```

### 5. Planning Data (NEW)
**Mock Location**: `mockPlanningData` and `mockEmployees` in `mockData.js`
**Current Implementation**: Object-based storage with employee-day keys
**Data Structure**:
```javascript
// Planning data format: "employeeId-day": hours
planningData: { [key: string]: number }

// Employee data
employees: [{
  id: number,
  name: string,
  department: string,
  avatar: string
}]
```

## API Endpoints to Implement

### Authentication Endpoints
```
POST /api/auth/login
- Body: { email: string, password: string }
- Response: { user: User, token: string }

POST /api/auth/logout
- Headers: Authorization: Bearer <token>
- Response: { message: string }

GET /api/auth/me
- Headers: Authorization: Bearer <token>
- Response: { user: User }
```

### User Management Endpoints
```
GET /api/users
- Headers: Authorization: Bearer <token>
- Query: ?search=string&page=number&limit=number
- Response: { users: User[], total: number }

POST /api/users
- Headers: Authorization: Bearer <token>
- Body: { name: string, email: string, role: string }
- Response: { user: User }

PUT /api/users/:id
- Headers: Authorization: Bearer <token>
- Body: { name?: string, email?: string, role?: string, status?: string }
- Response: { user: User }

DELETE /api/users/:id
- Headers: Authorization: Bearer <token>
- Response: { message: string }
```

### Dashboard Endpoints
```
GET /api/dashboard/stats
- Headers: Authorization: Bearer <token>
- Response: { stats: DashboardStat[] }
```

### Notifications Endpoints
```
GET /api/notifications
- Headers: Authorization: Bearer <token>
- Query: ?read=boolean&type=string
- Response: { notifications: Notification[] }

PUT /api/notifications/:id/read
- Headers: Authorization: Bearer <token>
- Response: { notification: Notification }

PUT /api/notifications/mark-all-read
- Headers: Authorization: Bearer <token>
- Response: { count: number }

DELETE /api/notifications/:id
- Headers: Authorization: Bearer <token>
- Response: { message: string }
```

### Planning Endpoints (NEW)
```
GET /api/planning/employees
- Headers: Authorization: Bearer <token>
- Response: { employees: Employee[] }

GET /api/planning/data
- Headers: Authorization: Bearer <token>
- Query: ?month=number&year=number
- Response: { planningData: { [key: string]: number } }

PUT /api/planning/data
- Headers: Authorization: Bearer <token>
- Body: { 
    month: number, 
    year: number, 
    changes: { [employeeId-day: string]: number } 
  }
- Response: { message: string, updatedCount: number }
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'Administrator' | 'Manager' | 'User' | 'Moderator',
  status: 'Active' | 'Inactive',
  avatar: string,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  read: boolean,
  userId: ObjectId (optional - null for global notifications),
  createdAt: Date,
  updatedAt: Date
}
```

### Employees Collection
```javascript
{
  _id: ObjectId,
  name: string,
  department: string,
  avatar: string,
  status: 'Active' | 'Inactive',
  createdAt: Date,
  updatedAt: Date
}
```

### Planning Collection
```javascript
{
  _id: ObjectId,
  employeeId: ObjectId,
  year: number,
  month: number,
  day: number,
  hours: number,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration Changes

### 1. Authentication Context Updates
- Replace localStorage check with API call to `/api/auth/me`
- Implement JWT token storage and automatic refresh
- Add API error handling for expired tokens

### 2. User Management Updates
**File**: `Dashboard.jsx`
- Replace `mockTableData` state with API calls
- Implement proper pagination and search via API
- Add loading states and error handling
- Update CRUD operations to use API endpoints

### 3. Dashboard Stats Updates
**File**: `Dashboard.jsx`
- Replace `mockDashboardData.stats` with API call
- Add real-time data refresh capability
- Implement loading states

### 4. Notifications Updates
**File**: `Notifications.jsx`
- Replace `mockNotifications` with API calls
- Implement real-time notifications (WebSocket optional)
- Add proper filtering and pagination

### 5. Planning Updates (NEW)
**File**: `Planning.jsx`
- Replace `mockPlanningData` and `mockEmployees` with API calls
- Implement batch update API for planning changes
- Add proper error handling and validation
- Implement month/year navigation with API calls

## Implementation Steps

1. **Backend Models**: Create MongoDB models for Users, Notifications, Employees, Planning
2. **Authentication**: Implement JWT-based auth middleware
3. **API Routes**: Create all CRUD endpoints with proper validation
4. **Frontend Integration**: Update components to use API calls
5. **Error Handling**: Implement proper error boundaries and user feedback
6. **Testing**: Test all CRUD operations and edge cases

## Error Handling Strategy

### Backend
- Use HTTP status codes appropriately (200, 201, 400, 401, 403, 404, 500)
- Return consistent error response format
- Implement proper validation with descriptive messages

### Frontend
- Show loading states during API calls
- Display user-friendly error messages
- Implement retry mechanisms for failed requests
- Handle network errors gracefully

## Security Considerations

- Hash passwords using bcrypt
- Implement JWT token expiration and refresh
- Add rate limiting for API endpoints
- Validate all inputs on both frontend and backend
- Implement proper CORS configuration
- Add request size limits for planning data updates