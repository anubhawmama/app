export const mockUsers = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'superadmin@demo.com',
    password: 'super123',
    role: 'SuperAdmin',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 2,
    name: 'System Admin',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'Admin',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 3,
    name: 'John Creator',
    email: 'creator@demo.com',
    password: 'creator123',
    role: 'Creator',
    departmentId: 1,
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 4,
    name: 'Jane Approver',
    email: 'approver@demo.com',
    password: 'approver123',
    role: 'Approver',
    departmentId: 1,
    avatar: '/api/placeholder/40/40'
  }
];

export const mockDashboardData = {
  stats: [
    {
      title: 'Total Users',
      value: '2,845',
      change: '+12.5% from last month'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2% from last month'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+5.4% from last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+2.1% from last month'
    }
  ]
};

export const mockTableData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Creator',
    departmentId: 1,
    status: 'Active',
    lastLogin: '2 hours ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Approver',
    departmentId: 2,
    status: 'Active',
    lastLogin: '1 day ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'User',
    departmentId: 1,
    status: 'Inactive',
    lastLogin: '1 week ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Creator',
    departmentId: 3,
    status: 'Active',
    lastLogin: '3 hours ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 5,
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'User',
    departmentId: 2,
    status: 'Active',
    lastLogin: '30 minutes ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'Approver',
    departmentId: 3,
    status: 'Inactive',
    lastLogin: '2 weeks ago',
    avatar: '/api/placeholder/32/32'
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Monthly Planning Request',
    message: 'Please submit your department planning numbers for October 2025.',
    type: 'info',
    timestamp: '2 hours ago',
    read: false,
    departmentId: 1,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Plan Approval Required',
    message: 'Engineering department plan is awaiting your approval.',
    type: 'warning',
    timestamp: '1 day ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Plan Approved',
    message: 'Your Marketing department plan has been approved.',
    type: 'success',
    timestamp: '2 days ago',
    read: true,
    departmentId: 2,
    priority: 'low'
  },
  {
    id: 4,
    title: 'System Update',
    message: 'New brand categories have been added to the system.',
    type: 'info',
    timestamp: '3 days ago',
    read: true,
    priority: 'low'
  },
  {
    id: 5,
    title: 'Planning Deadline',
    message: 'Reminder: Planning submission deadline is tomorrow.',
    type: 'error',
    timestamp: '1 week ago',
    read: true,
    departmentId: 1,
    priority: 'high'
  }
];

// System Metadata
export const mockDepartments = [
  {
    id: 1,
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development and technical operations',
    status: 'Active',
    createdAt: '2024-01-15',
    createdBy: 'System Admin'
  },
  {
    id: 2,
    name: 'Marketing',
    code: 'MKT',
    description: 'Marketing campaigns and brand promotion',
    status: 'Active',
    createdAt: '2024-01-15',
    createdBy: 'System Admin'
  },
  {
    id: 3,
    name: 'Sales',
    code: 'SAL',
    description: 'Sales operations and customer relations',
    status: 'Active',
    createdAt: '2024-01-15',
    createdBy: 'System Admin'
  },
  {
    id: 4,
    name: 'Product',
    code: 'PRD',
    description: 'Product management and strategy',
    status: 'Active',
    createdAt: '2024-02-01',
    createdBy: 'System Admin'
  },
  {
    id: 5,
    name: 'Finance',
    code: 'FIN',
    description: 'Financial planning and accounting',
    status: 'Active',
    createdAt: '2024-02-01',
    createdBy: 'System Admin'
  }
];

export const mockBrands = [
  {
    id: 1,
    name: 'TechCorp',
    code: 'TC',
    description: 'Main technology brand',
    status: 'Active',
    createdAt: '2024-01-10',
    createdBy: 'Super Admin'
  },
  {
    id: 2,
    name: 'InnovateX',
    code: 'IX',
    description: 'Innovation-focused sub-brand',
    status: 'Active',
    createdAt: '2024-01-10',
    createdBy: 'Super Admin'
  },
  {
    id: 3,
    name: 'CloudFirst',
    code: 'CF',
    description: 'Cloud services brand',
    status: 'Active',
    createdAt: '2024-01-20',
    createdBy: 'Super Admin'
  },
  {
    id: 4,
    name: 'DataPro',
    code: 'DP',
    description: 'Data analytics solutions',
    status: 'Inactive',
    createdAt: '2024-02-15',
    createdBy: 'Super Admin'
  }
];

export const mockCategories = [
  {
    id: 1,
    name: 'Software Development',
    code: 'SWDEV',
    description: 'All software development activities',
    status: 'Active',
    createdAt: '2024-01-12',
    createdBy: 'Super Admin'
  },
  {
    id: 2,
    name: 'Digital Marketing',
    code: 'DIGMKT',
    description: 'Online marketing and advertising',
    status: 'Active',
    createdAt: '2024-01-12',
    createdBy: 'Super Admin'
  },
  {
    id: 3,
    name: 'Customer Support',
    code: 'CUSSUPP',
    description: 'Customer service operations',
    status: 'Active',
    createdAt: '2024-01-12',
    createdBy: 'Super Admin'
  },
  {
    id: 4,
    name: 'Research & Development',
    code: 'RND',
    description: 'Research and innovation projects',
    status: 'Active',
    createdAt: '2024-01-25',
    createdBy: 'Super Admin'
  }
];

export const mockSubcategories = [
  {
    id: 1,
    name: 'Frontend Development',
    code: 'FRONTEND',
    categoryId: 1,
    description: 'User interface development',
    status: 'Active',
    createdAt: '2024-01-12',
    createdBy: 'Super Admin'
  },
  {
    id: 2,
    name: 'Backend Development',
    code: 'BACKEND',
    categoryId: 1,
    description: 'Server-side development',
    status: 'Active',
    createdAt: '2024-01-12',
    createdBy: 'Super Admin'
  },
  {
    id: 3,
    name: 'Mobile Development',
    code: 'MOBILE',
    categoryId: 1,
    description: 'Mobile application development',
    status: 'Active',
    createdAt: '2024-01-12',
    createdBy: 'Super Admin'
  },
  {
    id: 4,
    name: 'Social Media Marketing',
    code: 'SOCIAL',
    categoryId: 2,
    description: 'Social media campaigns and management',
    status: 'Active',
    createdAt: '2024-01-15',
    createdBy: 'Super Admin'
  },
  {
    id: 5,
    name: 'Content Marketing',
    code: 'CONTENT',
    categoryId: 2,
    description: 'Content creation and strategy',
    status: 'Active',
    createdAt: '2024-01-15',
    createdBy: 'Super Admin'
  },
  {
    id: 6,
    name: 'Email Support',
    code: 'EMAIL',
    categoryId: 3,
    description: 'Email-based customer support',
    status: 'Active',
    createdAt: '2024-01-18',
    createdBy: 'Super Admin'
  },
  {
    id: 7,
    name: 'Live Chat Support',
    code: 'CHAT',
    categoryId: 3,
    description: 'Real-time chat support',
    status: 'Active',
    createdAt: '2024-01-18',
    createdBy: 'Super Admin'
  }
];

// Enhanced employees with department relationships
export const mockEmployees = [
  {
    id: 1,
    name: 'Faustino Shields',
    email: 'faustino@company.com',
    departmentId: 1,
    role: 'Creator',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 2,
    name: 'Pat Schneider',
    email: 'pat@company.com',
    departmentId: 1,
    role: 'Approver',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 3,
    name: 'Aliya Schinner',
    email: 'aliya@company.com',
    departmentId: 4,
    role: 'Creator',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 4,
    name: 'Daan Aarden',
    email: 'daan@company.com',
    departmentId: 2,
    role: 'User',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 5,
    name: 'Marie Renault',
    email: 'marie@company.com',
    departmentId: 2,
    role: 'Approver',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 6,
    name: 'Loraine Stracke',
    email: 'loraine@company.com',
    departmentId: 5,
    role: 'Creator',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 7,
    name: 'Luis Lopez',
    email: 'luis@company.com',
    departmentId: 1,
    role: 'User',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 8,
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    departmentId: 2,
    role: 'Creator',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 9,
    name: 'Mike Chen',
    email: 'mike@company.com',
    departmentId: 1,
    role: 'User',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 10,
    name: 'Lisa Wong',
    email: 'lisa@company.com',
    departmentId: 4,
    role: 'Approver',
    avatar: '/api/placeholder/32/32'
  }
];

// Enhanced planning data with approval status
export const mockPlanningData = {
  '1-1': { planned: 8, actual: 7, status: 'approved', approvedBy: 2, approvedAt: '2025-09-01' },
  '1-2': { planned: 8, actual: 8, status: 'approved', approvedBy: 2, approvedAt: '2025-09-01' },
  '1-3': { planned: 8, actual: 6, status: 'pending', submittedBy: 1, submittedAt: '2025-09-15' },
  '2-1': { planned: 7, actual: 7, status: 'approved', approvedBy: 2, approvedAt: '2025-09-01' },
  '2-2': { planned: 8, actual: 8, status: 'approved', approvedBy: 2, approvedAt: '2025-09-01' },
  '3-1': { planned: 8, actual: 8, status: 'approved', approvedBy: 10, approvedAt: '2025-09-01' },
  '3-2': { planned: 8, actual: 7, status: 'pending', submittedBy: 3, submittedAt: '2025-09-14' },
  '8-1': { planned: 8, actual: 8, status: 'approved', approvedBy: 5, approvedAt: '2025-09-01' },
  '8-2': { planned: 8, actual: 9, status: 'rejected', rejectedBy: 5, rejectedAt: '2025-09-10', reason: 'Exceeds budget allocation' },
  // Add more planning data as needed
};

// Planning requests/intimations
export const mockPlanningRequests = [
  {
    id: 1,
    departmentId: 1,
    month: 10,
    year: 2025,
    status: 'sent',
    sentAt: '2025-09-15T10:00:00Z',
    sentBy: 2, // Admin
    dueDate: '2025-09-25',
    message: 'Please submit your October planning numbers including actual September data.',
    responses: [
      { userId: 1, respondedAt: '2025-09-16T14:30:00Z', status: 'submitted' }
    ]
  },
  {
    id: 2,
    departmentId: 2,
    month: 10,
    year: 2025,
    status: 'pending',
    sentAt: '2025-09-15T10:00:00Z',
    sentBy: 2,
    dueDate: '2025-09-25',
    message: 'Monthly planning submission required for Marketing department.',
    responses: []
  },
  {
    id: 3,
    departmentId: 4,
    month: 10,
    year: 2025,
    status: 'overdue',
    sentAt: '2025-09-10T10:00:00Z',
    sentBy: 2,
    dueDate: '2025-09-20',
    message: 'Urgent: Please submit overdue planning numbers for Product department.',
    responses: []
  }
];

// Enhanced product/SKU management
export const mockProducts = [
  {
    id: 1,
    name: 'TechCorp Laptop Pro',
    eanCode: '1234567890123',
    categoryId: 1, // Software Development
    subcategoryId: 1, // Frontend Development
    brandId: 1, // TechCorp
    mrp: 89999,
    status: 'Active',
    createdAt: '2024-01-15',
    createdBy: 'Super Admin'
  },
  {
    id: 2,
    name: 'InnovateX Mobile App',
    eanCode: '2345678901234',
    categoryId: 1, // Software Development
    subcategoryId: 3, // Mobile Development
    brandId: 2, // InnovateX
    mrp: 4999,
    status: 'Active',
    createdAt: '2024-01-20',
    createdBy: 'Super Admin'
  },
  {
    id: 3,
    name: 'CloudFirst Analytics',
    eanCode: '3456789012345',
    categoryId: 2, // Digital Marketing
    subcategoryId: 4, // Social Media Marketing
    brandId: 3, // CloudFirst
    mrp: 29999,
    status: 'Active',
    createdAt: '2024-02-01',
    createdBy: 'Super Admin'
  },
  {
    id: 4,
    name: 'DataPro Dashboard',
    eanCode: '4567890123456',
    categoryId: 2, // Digital Marketing
    subcategoryId: 5, // Content Marketing
    brandId: 4, // DataPro
    mrp: 19999,
    status: 'Active',
    createdAt: '2024-02-10',
    createdBy: 'Super Admin'
  },
  {
    id: 5,
    name: 'TechCorp Support Suite',
    eanCode: '5678901234567',
    categoryId: 3, // Customer Support
    subcategoryId: 6, // Email Support
    brandId: 1, // TechCorp
    mrp: 15999,
    status: 'Active',
    createdAt: '2024-02-15',
    createdBy: 'Super Admin'
  }
];

// Plans management
export const mockPlans = [
  {
    id: 1,
    name: 'Q1 2025 Sales Plan',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    status: 'completed',
    createdBy: 2, // Admin
    createdAt: '2024-12-15',
    description: 'First quarter sales planning for all departments'
  },
  {
    id: 2,
    name: 'Q2 2025 Product Launch',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    status: 'in-progress',
    createdBy: 2, // Admin
    createdAt: '2025-03-01',
    description: 'Product launch planning with marketing campaigns'
  },
  {
    id: 3,
    name: 'Annual Budget 2025',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'started',
    createdBy: 1, // SuperAdmin
    createdAt: '2024-11-15',
    description: 'Annual budget planning across all departments and products'
  }
];

// SKU-level planning data
export const mockSkuPlanningData = {
  // Format: "planId-departmentId-productId": { planned: number, actual: number, status: string }
  '1-1-1': { planned: 100, actual: 95, status: 'completed' }, // Q1 Plan - Engineering - TechCorp Laptop Pro
  '1-1-2': { planned: 150, actual: 140, status: 'completed' }, // Q1 Plan - Engineering - InnovateX Mobile App
  '1-2-3': { planned: 200, actual: 180, status: 'completed' }, // Q1 Plan - Marketing - CloudFirst Analytics  
  '1-2-4': { planned: 300, actual: 320, status: 'completed' }, // Q1 Plan - Marketing - DataPro Dashboard
  '1-3-5': { planned: 120, actual: 110, status: 'completed' }, // Q1 Plan - Sales - TechCorp Support Suite
  
  '2-1-1': { planned: 120, actual: 0, status: 'pending' }, // Q2 Plan - Engineering - TechCorp Laptop Pro
  '2-1-2': { planned: 180, actual: 45, status: 'in-progress' }, // Q2 Plan - Engineering - InnovateX Mobile App
  '2-2-3': { planned: 250, actual: 60, status: 'in-progress' }, // Q2 Plan - Marketing - CloudFirst Analytics
  '2-2-4': { planned: 350, actual: 0, status: 'pending' }, // Q2 Plan - Marketing - DataPro Dashboard
  '2-3-5': { planned: 140, actual: 35, status: 'in-progress' }, // Q2 Plan - Sales - TechCorp Support Suite
  
  '3-1-1': { planned: 500, actual: 125, status: 'in-progress' }, // Annual - Engineering - TechCorp Laptop Pro
  '3-1-2': { planned: 600, actual: 150, status: 'in-progress' }, // Annual - Engineering - InnovateX Mobile App
  '3-2-3': { planned: 800, actual: 200, status: 'in-progress' }, // Annual - Marketing - CloudFirst Analytics
  '3-2-4': { planned: 1000, actual: 250, status: 'in-progress' }, // Annual - Marketing - DataPro Dashboard
  '3-3-5': { planned: 400, actual: 100, status: 'in-progress' }, // Annual - Sales - TechCorp Support Suite
};

// Plan requests to departments
export const mockPlanRequests = [
  {
    id: 1,
    planId: 2,
    departmentId: 1,
    status: 'submitted',
    requestedAt: '2025-03-01T10:00:00Z',
    submittedAt: '2025-03-05T14:30:00Z',
    submittedBy: 1, // Faustino (Creator)
    message: 'Please submit your Q2 product planning numbers for all assigned SKUs.'
  },
  {
    id: 2,
    planId: 2,
    departmentId: 2,
    status: 'pending',
    requestedAt: '2025-03-01T10:00:00Z',
    submittedAt: null,
    submittedBy: null,
    message: 'Please submit your Q2 marketing planning numbers for all assigned SKUs.'
  },
  {
    id: 3,
    planId: 3,
    departmentId: 1,
    status: 'in-progress',
    requestedAt: '2024-11-15T09:00:00Z',
    submittedAt: null,
    submittedBy: null,
    message: 'Annual budget planning - please provide estimates for all products.'
  }
];

// Configurable permissions for system metadata access
export const mockSystemPermissions = {
  'SuperAdmin': {
    canViewDepartments: true,
    canViewBrands: true,
    canViewCategories: true,
    canViewSubcategories: true,
    canViewProducts: true,
    canEditPermissions: true
  },
  'Admin': {
    canViewDepartments: true,
    canViewBrands: true,
    canViewCategories: true,
    canViewSubcategories: true,
    canViewProducts: true,
    canEditPermissions: false
  },
  'Creator': {
    canViewDepartments: false,
    canViewBrands: true,
    canViewCategories: true,
    canViewSubcategories: true,
    canViewProducts: true,
    canEditPermissions: false
  },
  'Approver': {
    canViewDepartments: false,
    canViewBrands: true,
    canViewCategories: false,
    canViewSubcategories: false,
    canViewProducts: true,
    canEditPermissions: false
  },
  'User': {
    canViewDepartments: false,
    canViewBrands: false,
    canViewCategories: false,
    canViewSubcategories: false,
    canViewProducts: false,
    canEditPermissions: false
  }
};

// Role-based permissions
export const mockUserPermissions = {
    role: 'SuperAdmin',
    canEditSystemMetadata: true,
    canViewAllDepartments: true,
    canEditAllPlanning: true,
    canApproveAll: true,
    canSendRequests: true,
    canManageUsers: true,
    departmentAccess: 'all'
  },
  'Admin': {
    role: 'Admin',
    canEditSystemMetadata: false,
    canViewAllDepartments: true,
    canEditAllPlanning: false,
    canApproveAll: false,
    canSendRequests: true,
    canManageUsers: true,
    departmentAccess: 'all'
  },
  'Creator': {
    role: 'Creator',
    canEditSystemMetadata: false,
    canViewAllDepartments: false,
    canEditAllPlanning: false,
    canApproveAll: false,
    canSendRequests: false,
    canManageUsers: false,
    canCreatePlan: true,
    canSubmitActuals: true,
    departmentAccess: 'own'
  },
  'Approver': {
    role: 'Approver',
    canEditSystemMetadata: false,
    canViewAllDepartments: false,
    canEditAllPlanning: false,
    canApproveAll: false,
    canSendRequests: false,
    canManageUsers: false,
    canApprovePlan: true,
    canViewDepartmentData: true,
    departmentAccess: 'own'
  },
  'User': {
    role: 'User',
    canEditSystemMetadata: false,
    canViewAllDepartments: false,
    canEditAllPlanning: false,
    canApproveAll: false,
    canSendRequests: false,
    canManageUsers: false,
    canViewPlan: true,
    departmentAccess: 'own'
  }
};

export const mockPlanningHistory = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Faustino Shields',
    day: 1,
    month: 9,
    year: 2025,
    action: 'planned',
    oldValue: 6,
    newValue: 8,
    changedBy: 'Faustino Shields',
    changedAt: '2025-09-15T10:30:00Z',
    reason: 'Resource allocation update'
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: 'Faustino Shields',
    day: 1,
    month: 9,
    year: 2025,
    action: 'approved',
    value: 8,
    changedBy: 'Pat Schneider',
    changedAt: '2025-09-15T11:00:00Z',
    reason: 'Plan approved'
  },
  {
    id: 3,
    employeeId: 8,
    employeeName: 'Sarah Johnson',
    day: 2,
    month: 9,
    year: 2025,
    action: 'rejected',
    value: 9,
    changedBy: 'Marie Renault',
    changedAt: '2025-09-10T16:45:00Z',
    reason: 'Exceeds budget allocation'
  },
  {
    id: 4,
    employeeId: 3,
    employeeName: 'Aliya Schinner',
    day: 2,
    month: 9,
    year: 2025,
    action: 'submitted',
    value: 7,
    changedBy: 'Aliya Schinner',
    changedAt: '2025-09-14T14:20:00Z',
    reason: 'Monthly actual submission'
  }
];

// Mock analytics data
export const mockAnalyticsData = {
  planningTrend: [
    { label: 'Week 1', value: 320 },
    { label: 'Week 2', value: 450 },
    { label: 'Week 3', value: 380 },
    { label: 'Week 4', value: 520 },
    { label: 'Week 5', value: 490 },
    { label: 'Week 6', value: 610 },
    { label: 'Week 7', value: 580 }
  ],
  departmentHours: [
    { label: 'Engineering', value: 2400 },
    { label: 'Marketing', value: 1800 },
    { label: 'Sales', value: 1200 },
    { label: 'Product', value: 800 },
    { label: 'Finance', value: 600 }
  ],
  resourceDistribution: [
    { label: 'Development', value: 45, color: '#3b82f6' },
    { label: 'Marketing', value: 25, color: '#10b981' },
    { label: 'Sales', value: 15, color: '#f59e0b' },
    { label: 'Product', value: 10, color: '#ef4444' },
    { label: 'Other', value: 5, color: '#8b5cf6' }
  ],
  topPerformers: [
    { name: 'Faustino Shields', department: 'Engineering', hours: 180, growth: 12 },
    { name: 'Aliya Schinner', department: 'Product', hours: 165, growth: 8 },
    { name: 'Sarah Johnson', department: 'Marketing', hours: 152, growth: 15 },
    { name: 'Luis Lopez', department: 'Engineering', hours: 148, growth: 5 },
    { name: 'Loraine Stracke', department: 'Finance', hours: 140, growth: 18 }
  ],
  recentActivity: [
    { action: 'Plan approved for Engineering department', user: 'Pat Schneider', time: '2 hours ago' },
    { action: 'Plan rejected for Marketing team', user: 'Marie Renault', time: '4 hours ago' },
    { action: 'Monthly request sent to all departments', user: 'System Admin', time: '6 hours ago' },
    { action: 'Planning numbers submitted by Product', user: 'Aliya Schinner', time: '8 hours ago' },
    { action: 'New department created: Finance', user: 'Super Admin', time: '1 day ago' }
  ]
};