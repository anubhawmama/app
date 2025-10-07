import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Settings, 
  Bell, 
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  FileText,
  Building2,
  Layers,
  Target,
  RefreshCw
} from 'lucide-react';
import { mockUserPermissions } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const permissions = mockUserPermissions[user?.role] || {
    canViewReports: false,
    canManageUsers: false,
    canEditSystemMetadata: false,
    canAccessPlanning: false,
    canViewAnalytics: false,
    canSendRequests: false,
    canViewAllDepartments: false
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Data refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to refresh data",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const menuItems = [
    { 
      icon: Building2, 
      label: 'Dashboard', 
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    { 
      icon: Calendar, 
      label: 'Planning', 
      path: '/planning',
      active: location.pathname === '/planning'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics',
      active: location.pathname === '/analytics'
    },
    ...(permissions.canEditSystemMetadata ? [{
      icon: Settings, 
      label: 'System Management', 
      path: '/system-management',
      active: location.pathname === '/system-management'
    }] : []),
    ...(permissions.canSendRequests ? [{
      icon: FileText, 
      label: 'Planning Requests', 
      path: '/planning-requests',
      active: location.pathname === '/planning-requests'
    }] : []),
    ...(permissions.canAccessPlanning ? [{
      icon: Target, 
      label: 'Plan Management', 
      path: '/plan-management',
      active: location.pathname === '/plan-management'
    }] : []),
    { 
      icon: Activity, 
      label: 'Reports', 
      path: '/reports',
      active: location.pathname === '/reports'
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-slate-200 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <span className="font-semibold text-slate-900">Admin Panel</span>
          </div>
        </div>
        
        <nav className="px-4 pb-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    item.active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="text-slate-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
                <Bell className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-slate-900 text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-slate-900">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.role}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (pathname) => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/planning': 'Financial Planning',
    '/analytics': 'Analytics',
    '/system-management': 'System Management',
    '/planning-requests': 'Planning Requests',
    '/plan-management': 'Plan Management',
    '/reports': 'Reports & Analytics',
    '/notifications': 'Notifications'
  };
  
  return titles[pathname] || 'Admin Panel';
};

export default Layout;