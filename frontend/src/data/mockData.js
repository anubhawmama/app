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
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 2,
    name: 'Pat Schneider',
    department: 'Engineering',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 3,
    name: 'Aliya Schinner',
    department: 'Product',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 4,
    name: 'Daan Aarden',
    department: 'Design',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 5,
    name: 'Marie Renault',
    department: 'Design',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 6,
    name: 'Loraine Stracke',
    department: 'People',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 7,
    name: 'Luis Lopez',
    department: 'Engineering',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 8,
    name: 'Sarah Johnson',
    department: 'Marketing',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 9,
    name: 'Mike Chen',
    department: 'Engineering',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 10,
    name: 'Lisa Wong',
    department: 'Product',
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