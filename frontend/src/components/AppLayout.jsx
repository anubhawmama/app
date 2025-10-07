import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Settings, 
  Bell, 
  Building2,
  Calendar,
  BarChart3,
  FileText,
  Activity,
  Target
} from 'lucide-react';
import { mockUserPermissions } from '../data/mockData';

const AppLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const permissions = mockUserPermissions[user?.role] || {
    canViewReports: false,
    canManageUsers: false,
    canEditSystemMetadata: false,
    canAccessPlanning: false,
    canViewAnalytics: false,
    canSendRequests: false,
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: Building2, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Planning', path: '/planning' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ...(permissions.canEditSystemMetadata ? [{ icon: Settings, label: 'System Management', path: '/system-management' }] : []),
    ...(permissions.canSendRequests ? [{ icon: FileText, label: 'Planning Requests', path: '/planning-requests' }] : []),
    ...(permissions.canAccessPlanning ? [{ icon: Target, label: 'Plan Management', path: '/plan-management' }] : []),
    { icon: Activity, label: 'Reports', path: '/reports' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-slate-200">
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-slate-600">{subtitle}</p>}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;