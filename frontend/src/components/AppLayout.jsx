import React, { useState, useEffect } from 'react';
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
  Target,
  Shield,
  ChevronDown,
  ChevronRight,
  Tag,
  Layers,
  Key
} from 'lucide-react';
import { mockUserPermissions } from '../data/mockData';

const AppLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const permissions = mockUserPermissions[user?.role] || {
    canViewReports: false,
    canManageUsers: false,
    canEditSystemMetadata: false,
    canAccessPlanning: false,
    canViewAnalytics: false,
    canSendRequests: false,
  };

  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (submenuItems) => {
    return submenuItems.some(item => location.pathname === item.path);
  };

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Auto-expand menus when child routes are active
  useEffect(() => {
    const menuItems = [
      ...(permissions.canEditSystemMetadata ? [{
        submenuKey: 'systemManagement',
        submenuItems: [
          { path: '/system-management/departments' },
          { path: '/system-management/brands' },
          { path: '/system-management/categories' },
          { path: '/system-management/subcategories' },
          { path: '/system-management/products' },
          { path: '/system-management/users' },
          { path: '/permission' }
        ]
      }] : [])
    ];

    const newExpandedMenus = {};
    menuItems.forEach(item => {
      if (item.submenuItems && isSubmenuActive(item.submenuItems)) {
        newExpandedMenus[item.submenuKey] = true;
      }
    });

    setExpandedMenus(prev => ({
      ...prev,
      ...newExpandedMenus
    }));
  }, [location.pathname, permissions.canEditSystemMetadata]);

  const menuItems = [
    { icon: Building2, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Planning', path: '/planning' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ...(permissions.canEditSystemMetadata ? [{
      icon: Settings,
      label: 'System Management',
      hasSubmenu: true,
      submenuKey: 'systemManagement',
      submenuItems: [
        { icon: Building2, label: 'Departments', path: '/system-management/departments' },
        { icon: Tag, label: 'Brands', path: '/system-management/brands' },
        { icon: Layers, label: 'Categories', path: '/system-management/categories' },
        { icon: Layers, label: 'Subcategories', path: '/system-management/subcategories' },
        { icon: Target, label: 'Products', path: '/system-management/products' },
        { icon: Users, label: 'Users', path: '/system-management/users' },
        { icon: Shield, label: 'Permission', path: '/permission' }
      ]
    }] : []),
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
                {item.hasSubmenu ? (
                  <div>
                    {/* Main Menu Item with Submenu */}
                    <button
                      onClick={() => toggleSubmenu(item.submenuKey)}
                      className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isSubmenuActive(item.submenuItems)
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </div>
                      {expandedMenus[item.submenuKey] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Submenu Items */}
                    {expandedMenus[item.submenuKey] && (
                      <ul className="mt-2 ml-6 space-y-1">
                        {item.submenuItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (subItem.path) {
                                  navigate(subItem.path);
                                }
                              }}
                              className={`flex items-center px-2 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                                isActive(subItem.path)
                                  ? 'bg-slate-900 text-white'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <subItem.icon className="mr-2 h-3 w-3" />
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  /* Regular Menu Item */
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
                )}
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/notifications')}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {/* Notification badge - you can add logic to show unread count */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all"
                  onClick={() => navigate('/profile')}
                >
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-slate-900 text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="hidden md:block cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                  onClick={() => navigate('/profile')}
                >
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