import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Settings, 
  Bell, 
  Search,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
  FileText,
  Building2,
  Layers,
  Target,
  ChevronRight,
  UserPlus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { mockUserPermissions, mockTableData } from '../data/mockData';
import { TableLoader, LoadingSpinner, GridSkeleton, CardSkeleton } from './ui/loading';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true);
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

  // Simulate data loading
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setCardsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUsers(mockTableData);
      setCardsLoading(false);
      
      // Load user table data with additional delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      setLoading(false);
      setCardsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      toast({
        title: "Success",
        description: "Dashboard data refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to refresh dashboard data",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle={`Welcome back, ${user?.name}`}
    >
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cardsLoading ? (
              // Loading skeleton for KPI cards
              Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : (
              <>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total Users</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-slate-900">2,845</p>
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          +12.5% from last month
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Revenue</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-slate-900">$45,231</p>
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          +8.2% from last month
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                      <Activity className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Active Sessions</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-slate-900">1,234</p>
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          +5.4% from last month
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-slate-900">3.2%</p>
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          +2.1% from last month
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cardsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : (
              <>
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

                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => navigate('/reports')}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <span>Reports</span>
                    </CardTitle>
                    <CardDescription>Generate and export comprehensive business reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-900">8</div>
                        <div className="text-sm text-slate-600">Report Types</div>
                      </div>
                      <Button size="sm">
                        Generate Reports
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
                        <div className="text-2xl font-bold text-slate-900">2</div>
                        <div className="text-sm text-slate-600">Unread</div>
                      </div>
                      <Button size="sm">
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* User Management Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage your users and their permissions</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button className="bg-slate-900 hover:bg-slate-800">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <GridSkeleton 
                  rows={5} 
                  columns={6} 
                  headers={['Name', 'Email', 'Role', 'Status', 'Last Active', 'Actions']}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Last Active</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-12 text-slate-500">
                            {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-900">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{user.lastActive}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;