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
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Search,
  CheckSquare,
  Square,
  Building2
} from 'lucide-react';
import { mockDepartments } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const DepartmentLevelPermission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock permission data based on the original Permission component
  const [departmentPermissions, setDepartmentPermissions] = useState([
    {
      id: 1,
      departmentId: 1,
      departmentName: 'Marketing',
      roleName: 'Manager',
      permissions: {
        read: true,
        write: true,
        delete: false
      },
      lastModified: '2025-03-15',
      modifiedBy: 'System Admin'
    },
    {
      id: 2,
      departmentId: 1,
      departmentName: 'Marketing',
      roleName: 'Creator',
      permissions: {
        read: true,
        write: true,
        delete: false
      },
      lastModified: '2025-03-14',
      modifiedBy: 'Admin'
    },
    {
      id: 3,
      departmentId: 2,
      departmentName: 'Engineering',
      roleName: 'Manager',
      permissions: {
        read: true,
        write: true,
        delete: true
      },
      lastModified: '2025-03-13',
      modifiedBy: 'Super Admin'
    },
    {
      id: 4,
      departmentId: 2,
      departmentName: 'Engineering',
      roleName: 'Developer',
      permissions: {
        read: true,
        write: false,
        delete: false
      },
      lastModified: '2025-03-12',
      modifiedBy: 'Admin'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [newPermission, setNewPermission] = useState({
    departmentId: '',
    roleName: '',
    permissions: {
      read: false,
      write: false,
      delete: false
    }
  });

  const filteredPermissions = departmentPermissions.filter(permission =>
    permission.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (permissionId, permissionType) => {
    setDepartmentPermissions(prev => 
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
  };

  const handleAddPermission = () => {
    if (!newPermission.departmentId || !newPermission.roleName) {
      toast({
        title: "Error",
        description: "Please select department and enter role name",
        variant: "destructive"
      });
      return;
    }

    const department = mockDepartments.find(d => d.id === parseInt(newPermission.departmentId));
    const newId = Math.max(...departmentPermissions.map(p => p.id)) + 1;
    
    const permission = {
      id: newId,
      departmentId: parseInt(newPermission.departmentId),
      departmentName: department?.name || 'Unknown',
      roleName: newPermission.roleName,
      permissions: newPermission.permissions,
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: user?.name || 'Current User'
    };

    setDepartmentPermissions(prev => [...prev, permission]);
    setNewPermission({
      departmentId: '',
      roleName: '',
      permissions: { read: false, write: false, delete: false }
    });
    setShowAddDialog(false);
    
    toast({
      title: "Success",
      description: "Permission added successfully"
    });
  };

  const handleDeletePermission = (permissionId) => {
    setDepartmentPermissions(prev => 
      prev.filter(permission => permission.id !== permissionId)
    );
    
    toast({
      title: "Success",
      description: "Permission deleted successfully"
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
      <AppLayout title="Access Denied" subtitle="Department Level Permissions">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to manage department-level permissions.
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
      title="Department Level Permissions" 
      subtitle="Manage read, write, and delete permissions for roles within departments"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search departments or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Permission</DialogTitle>
                <DialogDescription>
                  Create permission settings for a role within a department
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={newPermission.departmentId.toString()} 
                    onValueChange={(value) => setNewPermission({...newPermission, departmentId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newPermission.roleName}
                    onChange={(e) => setNewPermission({...newPermission, roleName: e.target.value})}
                    placeholder="Enter role name (e.g., Manager, Creator)"
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="flex space-x-6 mt-2">
                    {['read', 'write', 'delete'].map(permType => (
                      <label key={permType} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPermission.permissions[permType]}
                          onChange={(e) => setNewPermission({
                            ...newPermission,
                            permissions: {
                              ...newPermission.permissions,
                              [permType]: e.target.checked
                            }
                          })}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm font-medium capitalize">{permType}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPermission}>
                  Add Permission
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Permissions Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Department Level Permissions</span>
            </CardTitle>
            <CardDescription>
              Manage read, write, and delete permissions for roles within departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Role</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700">Read</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700">Write</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700">Delete</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Last Modified</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Modified By</th>
                    <th className="text-center py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermissions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-slate-500">
                        {searchTerm ? 'No permissions found matching your search.' : 'No permissions configured.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPermissions.map((permission) => (
                      <tr key={permission.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-slate-900">{permission.departmentName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-medium">
                            {permission.roleName}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'read')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'write')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderPermissionCheckbox(permission, 'delete')}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {new Date(permission.lastModified).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {permission.modifiedBy}
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

export default DepartmentLevelPermission;