import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Search,
  CheckSquare,
  Square,
  User,
  Mail,
  Shield
} from 'lucide-react';
import { mockUsers, mockDepartments } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const UserLevelPermission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock user permission data
  const [userPermissions, setUserPermissions] = useState([
    {
      id: 1,
      userId: 1,
      userName: 'John Smith',
      email: 'john@demo.com',
      department: 'Marketing',
      role: 'Manager',
      permissions: {
        canViewReports: true,
        canEditPlans: true,
        canApproveRequests: false,
        canManageUsers: false,
        canAccessAnalytics: true
      },
      isActive: true,
      lastModified: '2025-03-15',
      modifiedBy: 'System Admin'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Sarah Johnson',
      email: 'sarah@demo.com',
      department: 'Engineering',
      role: 'Creator',
      permissions: {
        canViewReports: true,
        canEditPlans: true,
        canApproveRequests: false,
        canManageUsers: false,
        canAccessAnalytics: false
      },
      isActive: true,
      lastModified: '2025-03-14',
      modifiedBy: 'Admin'
    },
    {
      id: 3,
      userId: 3,
      userName: 'Mike Wilson',
      email: 'mike@demo.com',
      department: 'Sales',
      role: 'Approver',
      permissions: {
        canViewReports: true,
        canEditPlans: false,
        canApproveRequests: true,
        canManageUsers: false,
        canAccessAnalytics: true
      },
      isActive: true,
      lastModified: '2025-03-13',
      modifiedBy: 'Super Admin'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [newUserPermission, setNewUserPermission] = useState({
    userId: '',
    permissions: {
      canViewReports: false,
      canEditPlans: false,
      canApproveRequests: false,
      canManageUsers: false,
      canAccessAnalytics: false
    }
  });

  const filteredPermissions = userPermissions.filter(permission =>
    permission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (permissionId, permissionType) => {
    setUserPermissions(prev => 
      prev.map(permission => 
        permission.id === permissionId 
          ? {
              ...permission,
              permissions: {
                ...permission.permissions,
                [permissionType]: !permission.permissions[permissionType]
              },
              lastModified: new Date().toISOString().split('T')[0],
              modifiedBy: user?.name || 'Current User'
            }
          : permission
      )
    );
    
    toast({
      title: "Success",
      description: "User permission updated"
    });
  };

  const handleAddUserPermission = () => {
    if (!newUserPermission.userId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive"
      });
      return;
    }

    const selectedUser = mockUsers.find(u => u.id === parseInt(newUserPermission.userId));
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Selected user not found",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...userPermissions.map(p => p.id)) + 1;
    
    const permission = {
      id: newId,
      userId: selectedUser.id,
      userName: selectedUser.name,
      email: selectedUser.email,
      department: selectedUser.department || 'Not Assigned',
      role: selectedUser.role,
      permissions: newUserPermission.permissions,
      isActive: true,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: user?.name || 'Current User'
    };

    setUserPermissions(prev => [...prev, permission]);
    setNewUserPermission({
      userId: '',
      permissions: {
        canViewReports: false,
        canEditPlans: false,
        canApproveRequests: false,
        canManageUsers: false,
        canAccessAnalytics: false
      }
    });
    setShowAddDialog(false);
    
    toast({
      title: "Success",
      description: "User permission added successfully"
    });
  };

  const handleDeletePermission = (permissionId) => {
    setUserPermissions(prev => 
      prev.filter(permission => permission.id !== permissionId)
    );
    
    toast({
      title: "Success",
      description: "User permission deleted successfully"
    });
  };

  const renderPermissionCheckbox = (permission, type) => {
    const isChecked = permission.permissions[type];
    return (
      <button
        onClick={() => handlePermissionChange(permission.id, type)}
        className="flex items-center justify-center w-full h-full p-2 hover:bg-slate-50 transition-colors"
      >
        {isChecked ? (
          <CheckSquare className="w-5 h-5 text-green-600" />
        ) : (
          <Square className="w-5 h-5 text-slate-400" />
        )}
      </button>
    );
  };

  const canManagePermissions = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  if (!canManagePermissions) {
    return (
      <AppLayout title="Access Denied" subtitle="User Level Permissions">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to manage user-level permissions.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="User Level Permissions" 
      subtitle="Manage individual user permissions and access rights"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search users or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Add User Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add User Permission</DialogTitle>
                <DialogDescription>
                  Assign specific permissions to an individual user
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user">Select User</Label>
                  <Select 
                    value={newUserPermission.userId.toString()} 
                    onValueChange={(value) => setNewUserPermission({...newUserPermission, userId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map(user => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-slate-100 text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name} - {user.role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>User Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.keys(newUserPermission.permissions).map(permType => (
                      <label key={permType} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-slate-50 rounded">
                        <input
                          type="checkbox"
                          checked={newUserPermission.permissions[permType]}
                          onChange={(e) => setNewUserPermission({
                            ...newUserPermission,
                            permissions: {
                              ...newUserPermission.permissions,
                              [permType]: e.target.checked
                            }
                          })}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm font-medium">
                          {permType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUserPermission}>
                  Add Permission
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Permissions Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Level Permissions</span>
            </CardTitle>
            <CardDescription>
              Manage individual user permissions and access rights across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700 text-xs">View Reports</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700 text-xs">Edit Plans</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700 text-xs">Approve Requests</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700 text-xs">Manage Users</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700 text-xs">Access Analytics</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Modified</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermissions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-slate-500">
                        {searchTerm ? 'No user permissions found matching your search.' : 'No user permissions configured.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPermissions.map((permission) => (
                      <tr key={permission.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-slate-100">
                                {permission.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-900">{permission.userName}</div>
                              <div className="text-sm text-slate-500 flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{permission.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {permission.role}
                                </Badge>
                                <span className="text-xs text-slate-500">{permission.department}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'canViewReports')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'canEditPlans')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'canApproveRequests')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'canManageUsers')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'canAccessAnalytics')}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          <div>{new Date(permission.lastModified).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-500">by {permission.modifiedBy}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePermission(permission.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UserLevelPermission;