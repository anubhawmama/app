import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Settings,
  Shield,
  Send, 
  Bell, 
  User, 
  LogOut,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck,
  Calendar,
  BarChart3
} from 'lucide-react';
import { mockDashboardData, mockTableData, mockNotifications, mockUserPermissions } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState(mockTableData);
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setEditingData(row);
  };

  const handleSave = () => {
    setTableData(prev => 
      prev.map(row => 
        row.id === editingRow ? { ...editingData } : row
      )
    );
    setEditingRow(null);
    toast({
      title: "Success",
      description: "Record updated successfully",
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditingData({});
  };

  const handleDelete = (id) => {
    setTableData(prev => prev.filter(row => row.id !== id));
    toast({
      title: "Deleted",
      description: "Record deleted successfully",
    });
  };

  const filteredData = tableData.filter(row => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: Calendar, label: 'Planning', active: false, path: '/planning' },
    { icon: BarChart3, label: 'Analytics', active: false, path: '/analytics' },
    { icon: Users, label: 'Users' },
    { icon: Activity, label: 'Reports' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start ${item.active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDashboardData.stats.map((stat, index) => {
              const icons = [TrendingUp, DollarSign, UserCheck, Activity];
              const Icon = icons[index];
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/planning')}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Planning</span>
                </CardTitle>
                <CardDescription>Manage monthly planning and resource allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">85%</div>
                    <div className="text-sm text-slate-600">Utilization</div>
                  </div>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/analytics')}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>View comprehensive reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">12</div>
                    <div className="text-sm text-slate-600">Active Reports</div>
                  </div>
                  <Button size="sm">
                    View Charts
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/notifications')}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Stay updated with system alerts and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{unreadNotifications}</div>
                    <div className="text-sm text-slate-600">Unread</div>
                  </div>
                  <Button size="sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">User Management</CardTitle>
                  <CardDescription>Manage your users and their permissions</CardDescription>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          {editingRow === row.id ? (
                            <Input
                              value={editingData.name}
                              onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                              className="h-8"
                            />
                          ) : (
                            <div className="font-medium text-slate-900">{row.name}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingRow === row.id ? (
                            <Input
                              value={editingData.email}
                              onChange={(e) => setEditingData({...editingData, email: e.target.value})}
                              className="h-8"
                            />
                          ) : (
                            <div className="text-slate-600">{row.email}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={row.role === 'Admin' ? 'default' : 'secondary'}>
                            {row.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {editingRow === row.id ? (
                              <>
                                <Button size="sm" onClick={handleSave} className="h-8 px-3">
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-3">
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(row)} className="h-8 w-8 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDelete(row.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;