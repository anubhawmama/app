import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Tag, 
  Layers,
  Settings,
  Save,
  X,
  Users
} from 'lucide-react';
import { mockDepartments, mockBrands, mockCategories, mockSubcategories, mockUserPermissions, mockTableData, mockProducts } from '../data/mockData';
import BrandsManagement from './BrandsManagement';
import { toast } from '../hooks/use-toast';

const SystemManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [departments, setDepartments] = useState(mockDepartments);
  const [brands, setBrands] = useState(mockBrands);
  const [categories, setCategories] = useState(mockCategories);
  const [subcategories, setSubcategories] = useState(mockSubcategories);
  const [users, setUsers] = useState(mockTableData);
  const [products, setProducts] = useState(mockProducts);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('departments');
  const [newItem, setNewItem] = useState({});

  const userPermissions = mockUserPermissions[user?.role] || mockUserPermissions['User'] || {};
  const canEdit = userPermissions.canEditSystemMetadata || userPermissions.canManageUsers;

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to access system management.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAdd = () => {
    const newId = Math.max(...getActiveData().map(item => item.id)) + 1;
    const itemData = {
      ...newItem,
      id: newId,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: user?.name || 'Current User'
    };

    switch (activeTab) {
      case 'departments':
        setDepartments(prev => [...prev, itemData]);
        break;
      case 'brands':
        setBrands(prev => [...prev, itemData]);
        break;
      case 'categories':
        setCategories(prev => [...prev, itemData]);
        break;
      case 'subcategories':
        setSubcategories(prev => [...prev, itemData]);
        break;
      case 'users':
        setUsers(prev => [...prev, itemData]);
        break;
    }

    setNewItem({});
    setShowAddDialog(false);
    toast({ title: "Success", description: `${activeTab.slice(0, -1)} added successfully` });
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
  };

  const handleSave = (id, updatedData) => {
    switch (activeTab) {
      case 'departments':
        setDepartments(prev => prev.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        ));
        break;
      case 'brands':
        setBrands(prev => prev.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        ));
        break;
      case 'categories':
        setCategories(prev => prev.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        ));
        break;
      case 'subcategories':
        setSubcategories(prev => prev.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        ));
        break;
      case 'users':
        setUsers(prev => prev.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        ));
        break;
    }
    setEditingItem(null);
    toast({ title: "Success", description: "Item updated successfully" });
  };

  const handleDelete = (id) => {
    switch (activeTab) {
      case 'departments':
        setDepartments(prev => prev.filter(item => item.id !== id));
        break;
      case 'brands':
        setBrands(prev => prev.filter(item => item.id !== id));
        break;
      case 'categories':
        setCategories(prev => prev.filter(item => item.id !== id));
        break;
      case 'subcategories':
        setSubcategories(prev => prev.filter(item => item.id !== id));
        break;
      case 'users':
        setUsers(prev => prev.filter(item => item.id !== id));
        break;
    }
    toast({ title: "Success", description: "Item deleted successfully" });
  };

  const getActiveData = () => {
    switch (activeTab) {
      case 'departments': return departments;
      case 'brands': return brands;
      case 'categories': return categories;
      case 'subcategories': return subcategories;
      case 'users': return users;
      default: return [];
    }
  };

  const getTabConfig = () => {
    const configs = {
      departments: {
        title: 'Departments',
        icon: Building2,
        fields: ['name', 'code', 'description'],
        color: 'blue'
      },
      brands: {
        title: 'Brands',
        icon: Tag,
        fields: ['name', 'code', 'description'],
        color: 'green'
      },
      categories: {
        title: 'Categories',
        icon: Layers,
        fields: ['name', 'code', 'description'],
        color: 'purple'
      },
      subcategories: {
        title: 'Subcategories',
        icon: Layers,
        fields: ['name', 'code', 'categoryId', 'description'],
        color: 'orange'
      },
      users: {
        title: 'Users',
        icon: Users,
        fields: ['name', 'email', 'role', 'departmentId'],
        color: 'indigo'
      }
    };
    return configs[activeTab];
  };

  const EditableRow = ({ item }) => {
    const [editData, setEditData] = useState(item);
    const config = getTabConfig();

    return (
      <tr className="border-b border-slate-100">
        <td className="py-3 px-4">
          <Input
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            className="h-8"
          />
        </td>
        <td className="py-3 px-4">
          <Input
            value={editData.code}
            onChange={(e) => setEditData({...editData, code: e.target.value})}
            className="h-8"
          />
        </td>
        {activeTab === 'subcategories' && (
          <td className="py-3 px-4">
            <Select 
              value={editData.categoryId?.toString()} 
              onValueChange={(value) => setEditData({...editData, categoryId: parseInt(value)})}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </td>
        )}
        <td className="py-3 px-4">
          <Input
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            className="h-8"
          />
        </td>
        <td className="py-3 px-4">
          <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => handleSave(item.id, editData)}
              className="h-8 px-3"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingItem(null)}
              className="h-8 px-3"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const RegularRow = ({ item }) => {
    return (
      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
        <td className="py-3 px-4 text-slate-600">{item.code}</td>
        {activeTab === 'subcategories' && (
          <td className="py-3 px-4 text-slate-600">
            {categories.find(cat => cat.id === item.categoryId)?.name || 'N/A'}
          </td>
        )}
        <td className="py-3 px-4 text-slate-600">{item.description}</td>
        <td className="py-3 px-4">
          <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(item.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const config = getTabConfig();
  const data = getActiveData();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-slate-600" />
              <h1 className="text-xl font-semibold text-slate-900">System Management</h1>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="departments" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Departments</span>
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Brands</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="subcategories" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Subcategories</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Departments, Categories, Subcategories - Standard tabs */}
          {['departments', 'categories', 'subcategories'].map(tab => {
            const config = getTabConfig(tab);
            const data = getData(tab);
            
            return (
              <TabsContent key={tab} value={tab} className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <config.icon className="h-5 w-5" />
                          <span>Manage {config.title}</span>
                        </CardTitle>
                        <CardDescription>
                          Add, edit, or remove {config.title.toLowerCase()} in the system
                        </CardDescription>
                      </div>
                      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                          <Button className="bg-slate-900 hover:bg-slate-800">
                            <Plus className="h-4 w-4 mr-2" />
                            Add {config.title.slice(0, -1)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New {config.title.slice(0, -1)}</DialogTitle>
                            <DialogDescription>
                              Create a new {config.title.toLowerCase().slice(0, -1)} in the system
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={newItem.name || ''}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                placeholder="Enter name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="code">Code</Label>
                              <Input
                                id="code"
                                value={newItem.code || ''}
                                onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                                placeholder="Enter code"
                              />
                            </div>
                            {tab === 'subcategories' && (
                              <div>
                                <Label htmlFor="category">Category</Label>
                                <Select 
                                  value={newItem.categoryId?.toString()} 
                                  onValueChange={(value) => setNewItem({...newItem, categoryId: parseInt(value)})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map(cat => (
                                      <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newItem.description || ''}
                                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                                placeholder="Enter description"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAdd}>
                              Add {config.title.slice(0, -1)}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-700">Code</th>
                            {tab === 'subcategories' && (
                              <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                            )}
                            <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item) => 
                            editingItem === item.id ? (
                              <EditableRow key={item.id} item={item} />
                            ) : (
                              <RegularRow key={item.id} item={item} />
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}

          {/* Brands Tab - API Integration */}
          <TabsContent value="brands" className="space-y-6">
            <BrandsManagement />
          </TabsContent>
          
          {/* Users Tab - Special handling */}
          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Manage Users</span>
                    </CardTitle>
                    <CardDescription>
                      Add, edit, or remove users and assign them to departments with roles
                    </CardDescription>
                  </div>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-slate-900 hover:bg-slate-800">
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account and assign role and department
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="userName">Full Name</Label>
                          <Input
                            id="userName"
                            value={newItem.name || ''}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userEmail">Email Address</Label>
                          <Input
                            id="userEmail"
                            type="email"
                            value={newItem.email || ''}
                            onChange={(e) => setNewItem({...newItem, email: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userRole">Role</Label>
                          <Select 
                            value={newItem.role || ''} 
                            onValueChange={(value) => setNewItem({...newItem, role: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Creator">Creator</SelectItem>
                              <SelectItem value="Approver">Approver</SelectItem>
                              <SelectItem value="User">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="userDepartment">Department</Label>
                          <Select 
                            value={newItem.departmentId?.toString()} 
                            onValueChange={(value) => setNewItem({...newItem, departmentId: parseInt(value)})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                  {dept.name} - {dept.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="userPassword">Initial Password</Label>
                          <Input
                            id="userPassword"
                            type="password"
                            value={newItem.password || ''}
                            onChange={(e) => setNewItem({...newItem, password: e.target.value})}
                            placeholder="Enter initial password"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAdd}>
                          Add User
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => (
                        <tr key={userItem.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-900">{userItem.name}</td>
                          <td className="py-3 px-4 text-slate-600">{userItem.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={userItem.role === 'SuperAdmin' || userItem.role === 'Admin' ? 'default' : 'secondary'}>
                              {userItem.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {departments.find(d => d.id === userItem.departmentId)?.name || 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={userItem.status === 'Active' ? 'default' : 'secondary'}>
                              {userItem.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(userItem)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(userItem.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemManagement;