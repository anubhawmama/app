import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2,
  Save,
  X,
  Search
} from 'lucide-react';
import { mockDepartments } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const Departments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [departments, setDepartments] = useState(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    budgetAllocated: ''
  });

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingDept) {
      setDepartments(prev => 
        prev.map(dept => 
          dept.id === editingDept.id 
            ? { ...dept, ...formData }
            : dept
        )
      );
      toast({
        title: "Success",
        description: "Department updated successfully"
      });
    } else {
      const newDept = {
        id: Math.max(...departments.map(d => d.id)) + 1,
        ...formData
      };
      setDepartments(prev => [...prev, newDept]);
      toast({
        title: "Success",
        description: "Department created successfully"
      });
    }

    resetForm();
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      head: dept.head || '',
      budgetAllocated: dept.budgetAllocated || ''
    });
    setShowDialog(true);
  };

  const handleDelete = (deptId) => {
    setDepartments(prev => prev.filter(dept => dept.id !== deptId));
    toast({
      title: "Success",
      description: "Department deleted successfully"
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', head: '', budgetAllocated: '' });
    setEditingDept(null);
    setShowDialog(false);
  };

  return (
    <AppLayout title="Departments" subtitle="Manage organization departments and their details">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => resetForm()}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDept ? 'Edit Department' : 'Add New Department'}
                </DialogTitle>
                <DialogDescription>
                  {editingDept ? 'Update department information' : 'Create a new department for the organization'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Marketing, Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the department"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="head">Department Head</Label>
                  <Input
                    id="head"
                    value={formData.head}
                    onChange={(e) => setFormData(prev => ({ ...prev, head: e.target.value }))}
                    placeholder="Name of department head"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Allocated</Label>
                  <Input
                    id="budget"
                    value={formData.budgetAllocated}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetAllocated: e.target.value }))}
                    placeholder="Annual budget amount"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingDept ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Departments List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Departments</span>
            </CardTitle>
            <CardDescription>
              Manage organization departments, their responsibilities, and leadership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDepartments.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">No departments found</p>
                  <p className="text-sm text-slate-400">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first department to get started'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDepartments.map((dept) => (
                    <Card key={dept.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            {dept.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(dept)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(dept.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">{dept.description}</p>
                        
                        {dept.head && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Department Head:</span>
                            <span className="font-medium text-slate-900">{dept.head}</span>
                          </div>
                        )}
                        
                        {dept.budgetAllocated && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Budget:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {dept.budgetAllocated}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>ID: {dept.id}</span>
                            <span>Active</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Departments;