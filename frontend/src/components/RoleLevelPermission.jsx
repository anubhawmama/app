import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Search,
  CheckSquare,
  Square,
  Shield,
  Crown,
  UserCheck
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const RoleLevelPermission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock role permission data based on the existing mockUserPermissions structure
  const [rolePermissions, setRolePermissions] = useState([
    {
      id: 1,
      roleName: 'SuperAdmin',
      description: 'Complete system access with all administrative privileges',
      permissions: {
        canEditSystemMetadata: true,
        canViewAllDepartments: true,
        canEditAllPlanning: true,
        canApproveAll: true,
        canSendRequests: true,
        canManageUsers: true,
        canCreatePlans: true,
        canViewReports: true,
        canViewAnalytics: true
      },
      userCount: 1,
      isActive: true,
      lastModified: '2025-03-10',
      modifiedBy: 'System'
    },
    {
      id: 2,
      roleName: 'Admin',
      description: 'Administrative access with departmental oversight',
      permissions: {
        canEditSystemMetadata: true,
        canViewAllDepartments: true,
        canEditAllPlanning: false,
        canApproveAll: false,
        canSendRequests: true,
        canManageUsers: true,
        canCreatePlans: true,
        canViewReports: true,
        canViewAnalytics: true
      },
      userCount: 3,
      isActive: true,
      lastModified: '2025-03-12',
      modifiedBy: 'Super Admin'
    },
    {
      id: 3,
      roleName: 'Creator',
      description: 'Create and edit planning content within assigned departments',
      permissions: {
        canEditSystemMetadata: false,
        canViewAllDepartments: false,
        canEditAllPlanning: false,
        canApproveAll: false,
        canSendRequests: false,
        canManageUsers: false,
        canCreatePlans: false,
        canViewReports: true,
        canViewAnalytics: false
      },
      userCount: 8,
      isActive: true,
      lastModified: '2025-03-14',
      modifiedBy: 'Admin'
    },
    {
      id: 4,
      roleName: 'Approver',
      description: 'Review and approve planning submissions',
      permissions: {
        canEditSystemMetadata: false,
        canViewAllDepartments: false,
        canEditAllPlanning: false,
        canApproveAll: false,
        canSendRequests: false,
        canManageUsers: false,
        canCreatePlans: false,
        canViewReports: true,
        canViewAnalytics: true
      },
      userCount: 5,
      isActive: true,
      lastModified: '2025-03-11',
      modifiedBy: 'Admin'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    roleName: '',
    description: '',
    permissions: {
      canEditSystemMetadata: false,
      canViewAllDepartments: false,
      canEditAllPlanning: false,
      canApproveAll: false,
      canSendRequests: false,
      canManageUsers: false,
      canCreatePlans: false,
      canViewReports: false,
      canViewAnalytics: false
    }
  });

  const filteredRoles = rolePermissions.filter(role =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (roleId, permissionType) => {
    setRolePermissions(prev => 
      prev.map(role => 
        role.id === roleId 
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [permissionType]: !role.permissions[permissionType]
              },
              lastModified: new Date().toISOString().split('T')[0],
              modifiedBy: user?.name || 'Current User'
            }
          : role
      )
    );
    
    toast({
      title: "Success",
      description: "Role permission updated"
    });
  };

  const handleAddRole = () => {
    if (!roleForm.roleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingRole) {
      setRolePermissions(prev => 
        prev.map(role => 
          role.id === editingRole.id 
            ? {
                ...role,
                ...roleForm,
                lastModified: new Date().toISOString().split('T')[0],
                modifiedBy: user?.name || 'Current User'
              }
            : role
        )
      );
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
    } else {
      const newId = Math.max(...rolePermissions.map(r => r.id)) + 1;
      
      const newRole = {
        id: newId,
        ...roleForm,
        userCount: 0,
        isActive: true,
        lastModified: new Date().toISOString().split('T')[0],
        modifiedBy: user?.name || 'Current User'
      };

      setRolePermissions(prev => [...prev, newRole]);
      toast({
        title: "Success",
        description: "Role created successfully"
      });
    }

    resetForm();
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({
      roleName: role.roleName,
      description: role.description,
      permissions: { ...role.permissions }
    });
    setShowAddDialog(true);
  };

  const handleDeleteRole = (roleId) => {
    const role = rolePermissions.find(r => r.id === roleId);
    if (role && role.userCount > 0) {
      toast({
        title: "Error",
        description: `Cannot delete role with ${role.userCount} assigned users`,
        variant: "destructive"
      });
      return;
    }

    setRolePermissions(prev => 
      prev.filter(role => role.id !== roleId)
    );
    
    toast({
      title: "Success",
      description: "Role deleted successfully"
    });
  };

  const resetForm = () => {
    setRoleForm({
      roleName: '',
      description: '',
      permissions: {
        canEditSystemMetadata: false,
        canViewAllDepartments: false,
        canEditAllPlanning: false,
        canApproveAll: false,
        canSendRequests: false,
        canManageUsers: false,
        canCreatePlans: false,
        canViewReports: false,
        canViewAnalytics: false
      }
    });
    setEditingRole(null);
    setShowAddDialog(false);
  };

  const renderPermissionCheckbox = (role, type) => {
    const isChecked = role.permissions[type];
    return (
      <button
        onClick={() => handlePermissionChange(role.id, type)}
        className="flex items-center justify-center w-full h-full p-2 hover:bg-slate-50 transition-colors"
        disabled={role.roleName === 'SuperAdmin' && type === 'canEditSystemMetadata'}
      >
        {isChecked ? (
          <CheckSquare className="w-5 h-5 text-green-600" />
        ) : (
          <Square className="w-5 h-5 text-slate-400" />
        )}
      </button>
    );
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'SuperAdmin':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'Admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'Creator':
        return <Edit className="w-4 h-4 text-green-600" />;
      case 'Approver':
        return <UserCheck className="w-4 h-4 text-orange-600" />;
      default:
        return <Key className="w-4 h-4 text-gray-600" />;
    }
  };

  const canManagePermissions = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  if (!canManagePermissions) {
    return (
      <AppLayout title="Access Denied" subtitle="Role Level Permissions">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to manage role-level permissions.
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
      title="Role Level Permissions" 
      subtitle="Manage system roles and their associated permissions"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => resetForm()}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                {editingRole ? 'Edit Role' : 'Add Role'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </DialogTitle>
                <DialogDescription>
                  {editingRole ? 'Update role information and permissions' : 'Create a new system role with specific permissions'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={roleForm.roleName}
                      onChange={(e) => setRoleForm({...roleForm, roleName: e.target.value})}
                      placeholder="e.g., Manager, Editor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                      placeholder="Brief role description"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-semibold">Role Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {Object.keys(roleForm.permissions).map(permType => (
                      <label key={permType} className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-slate-50 rounded-lg border">
                        <input
                          type="checkbox"
                          checked={roleForm.permissions[permType]}
                          onChange={(e) => setRoleForm({
                            ...roleForm,
                            permissions: {
                              ...roleForm.permissions,
                              [permType]: e.target.checked
                            }
                          })}
                          className="rounded border-slate-300"
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {permType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="text-xs text-slate-500">
                            {permType === 'canEditSystemMetadata' && 'Manage system settings and metadata'}
                            {permType === 'canViewAllDepartments' && 'Access data from all departments'}
                            {permType === 'canEditAllPlanning' && 'Edit planning data across all departments'}
                            {permType === 'canApproveAll' && 'Approve planning requests from any department'}
                            {permType === 'canSendRequests' && 'Send planning requests to departments'}
                            {permType === 'canManageUsers' && 'Create, edit, and delete user accounts'}
                            {permType === 'canCreatePlans' && 'Create new planning cycles'}
                            {permType === 'canViewReports' && 'Access reports and analytics'}
                            {permType === 'canViewAnalytics' && 'View system analytics and insights'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleAddRole}>
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoles.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No roles found</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first role to get started'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRoles.map((role) => (
              <Card key={role.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(role.roleName)}
                      <div>
                        <CardTitle className="text-lg">{role.roleName}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                          </Badge>
                          <Badge 
                            variant={role.isActive ? 'default' : 'secondary'}
                            className={role.isActive ? 'bg-green-100 text-green-800' : ''}
                          >
                            {role.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditRole(role)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {role.roleName !== 'SuperAdmin' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRole(role.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{role.description}</p>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-2">Permissions</div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(role.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-1 text-xs">
                          {value ? (
                            <CheckSquare className="w-3 h-3 text-green-600" />
                          ) : (
                            <Square className="w-3 h-3 text-slate-300" />
                          )}
                          <span className={value ? 'text-slate-700' : 'text-slate-400'}>
                            {key.replace(/^can/, '').replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 pt-2 border-t">
                    Last modified: {new Date(role.lastModified).toLocaleDateString()} by {role.modifiedBy}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RoleLevelPermission;