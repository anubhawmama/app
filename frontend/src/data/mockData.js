export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'Administrator',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@demo.com',
    password: 'password123',
    role: 'Manager',
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
    role: 'Admin',
    status: 'Active',
    lastLogin: '2 hours ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '1 day ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '1 week ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Moderator',
    status: 'Active',
    lastLogin: '3 hours ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 5,
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '30 minutes ago',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2 weeks ago',
    avatar: '/api/placeholder/32/32'
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: 'New User Registration',
    message: 'Emma Davis has registered and is awaiting approval.',
    type: 'info',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 2,
    title: 'System Update',
    message: 'Security patch has been successfully applied.',
    type: 'success',
    timestamp: '1 day ago',
    read: false
  },
  {
    id: 3,
    title: 'Storage Warning',
    message: 'Database storage is approaching 80% capacity.',
    type: 'warning',
    timestamp: '2 days ago',
    read: true
  },
  {
    id: 4,
    title: 'Backup Complete',
    message: 'Daily backup completed successfully.',
    type: 'success',
    timestamp: '3 days ago',
    read: true
  },
  {
    id: 5,
    title: 'Failed Login Attempt',
    message: 'Multiple failed login attempts detected for user: john@demo.com',
    type: 'error',
    timestamp: '1 week ago',
    read: true
  }
];

// New mock data for employees and planning
export const mockEmployees = [
  {
    id: 1,
    name: 'Faustino Shields',
    department: 'Engineering',
    entity: 'Main',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 2,
    name: 'Pat Schneider',
    department: 'Engineering',
    entity: 'Main',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 3,
    name: 'Aliya Schinner',
    department: 'Product',
    entity: 'Innovation Lab',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 4,
    name: 'Daan Aarden',
    department: 'Design',
    entity: 'Main',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 5,
    name: 'Marie Renault',
    department: 'Design',
    entity: 'Creative Studio',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 6,
    name: 'Loraine Stracke',
    department: 'People',
    entity: 'Main',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 7,
    name: 'Luis Lopez',
    department: 'Engineering',
    entity: 'R&D Division',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 8,
    name: 'Sarah Johnson',
    department: 'Marketing',
    entity: 'Main',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 9,
    name: 'Mike Chen',
    department: 'Engineering',
    entity: 'Cloud Team',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 10,
    name: 'Lisa Wong',
    department: 'Product',
    entity: 'Innovation Lab',
    avatar: '/api/placeholder/32/32'
  }
];

// Mock planning data - format: "employeeId-day": hours
export const mockPlanningData = {
  '1-1': 8, '1-2': 8, '1-3': 8, '1-4': 8, '1-5': 6,
  '2-1': 7, '2-2': 8, '2-3': 8, '2-4': 8, '2-5': 8,
  '3-1': 8, '3-2': 8, '3-3': 6, '3-4': 8, '3-5': 8,
  '4-1': 8, '4-2': 8, '4-3': 8, '4-4': 8, '4-5': 8,
  '5-1': 6, '5-2': 8, '5-3': 8, '5-4': 8, '5-5': 8,
  '6-1': 8, '6-2': 8, '6-3': 8, '6-4': 8, '6-5': 8,
  '7-1': 8, '7-2': 8, '7-3': 8, '7-4': 8, '7-5': 8,
  '8-1': 8, '8-2': 8, '8-3': 8, '8-4': 8, '8-5': 8,
  '9-1': 8, '9-2': 8, '9-3': 8, '9-4': 8, '9-5': 8,
  '10-1': 8, '10-2': 8, '10-3': 8, '10-4': 8, '10-5': 8,
  // Add more days as needed
};

// Mock planning history
export const mockPlanningHistory = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Faustino Shields',
    day: 1,
    month: 9,
    year: 2025,
    oldValue: 6,
    newValue: 8,
    changedBy: 'Admin User',
    changedAt: '2025-09-15T10:30:00Z',
    reason: 'Resource allocation update'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Pat Schneider',
    day: 3,
    month: 9,
    year: 2025,
    oldValue: 8,
    newValue: 6,
    changedBy: 'Manager User',
    changedAt: '2025-09-15T09:15:00Z',
    reason: 'Sick leave adjustment'
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'Aliya Schinner',
    day: 5,
    month: 9,
    year: 2025,
    oldValue: 4,
    newValue: 8,
    changedBy: 'Admin User',
    changedAt: '2025-09-14T16:45:00Z',
    reason: 'Overtime approval'
  }
];

// Mock user permissions
export const mockUserPermissions = {
  'Administrator': {
    role: 'Admin',
    canEdit: true,
    canDelete: true,
    canViewAll: true,
    departments: ['Engineering', 'Product', 'Design', 'People', 'Marketing']
  },
  'Manager': {
    role: 'Manager',
    canEdit: true,
    canDelete: false,
    canViewAll: false,
    departments: ['Engineering', 'Product']
  },
  'User': {
    role: 'User',
    canEdit: false,
    canDelete: false,
    canViewAll: false,
    departments: []
  }
};

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
    { label: 'Product', value: 1800 },
    { label: 'Design', value: 1200 },
    { label: 'Marketing', value: 800 },
    { label: 'People', value: 600 }
  ],
  resourceDistribution: [
    { label: 'Development', value: 45, color: '#3b82f6' },
    { label: 'Design', value: 25, color: '#10b981' },
    { label: 'Management', value: 15, color: '#f59e0b' },
    { label: 'Research', value: 10, color: '#ef4444' },
    { label: 'Other', value: 5, color: '#8b5cf6' }
  ],
  topPerformers: [
    { name: 'Faustino Shields', department: 'Engineering', hours: 180, growth: 12 },
    { name: 'Aliya Schinner', department: 'Product', hours: 165, growth: 8 },
    { name: 'Marie Renault', department: 'Design', hours: 152, growth: 15 },
    { name: 'Luis Lopez', department: 'Engineering', hours: 148, growth: 5 },
    { name: 'Sarah Johnson', department: 'Marketing', hours: 140, growth: 18 }
  ],
  recentActivity: [
    { action: 'Planning updated for Engineering team', user: 'Admin User', time: '2 hours ago' },
    { action: 'New employee added to Product department', user: 'HR Manager', time: '4 hours ago' },
    { action: 'Weekly report generated', user: 'System', time: '6 hours ago' },
    { action: 'Overtime approved for Design team', user: 'Project Manager', time: '8 hours ago' },
    { action: 'Resource allocation optimized', user: 'Operations Lead', time: '1 day ago' }
  ]
};