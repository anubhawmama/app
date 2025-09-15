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