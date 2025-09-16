import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Send,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { mockPlans, mockDepartments, mockUserPermissions } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const PlanManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState(mockPlans);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const userPermissions = mockUserPermissions[user?.role] || mockUserPermissions['User'] || {};
  const canCreatePlans = userPermissions.canCreatePlans;

  if (!canCreatePlans) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to manage plans.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreatePlan = async () => {
    const newId = Math.max(...plans.map(p => p.id)) + 1;
    const planData = {
      id: newId,
      ...newPlan,
      status: 'started',
      createdBy: user?.id || 2,
      createdAt: new Date().toISOString()
    };

    setPlans(prev => [planData, ...prev]);
    
    // Simulate sending requests to all departments
    toast({
      title: "Plan Created Successfully",
      description: `${newPlan.name} has been created and requests sent to all departments.`,
    });

    setNewPlan({
      name: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowCreateDialog(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'started':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      started: 'secondary',
      'in-progress': 'default',
      completed: 'default',
      paused: 'outline'
    };
    const colors = {
      started: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const calculateProgress = (plan) => {
    const now = new Date();
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const viewPlanDetails = (planId) => {
    navigate(`/planning?planId=${planId}`);
  };

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
              <Calendar className="h-5 w-5 text-slate-600" />
              <h1 className="text-xl font-semibold text-slate-900">Plan Management</h1>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
                <DialogDescription>
                  Create a new planning cycle and automatically send requests to all departments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input
                    id="planName"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="Enter plan name (e.g., Q3 2025 Revenue Plan)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newPlan.startDate}
                      onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newPlan.endDate}
                      onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                    placeholder="Describe the plan objectives and requirements..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePlan}>
                  <Send className="h-4 w-4 mr-2" />
                  Create & Send Requests
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Plans</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{plans.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {plans.filter(p => p.status === 'in-progress').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {plans.filter(p => p.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Departments</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{mockDepartments.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Active Plans</span>
            </CardTitle>
            <CardDescription>
              Manage planning cycles and track department submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No plans created yet</p>
                </div>
              ) : (
                plans.map((plan) => (
                  <div key={plan.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {getStatusIcon(plan.status)}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                          <p className="text-slate-600 mt-1">{plan.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                            <span>Start: {new Date(plan.startDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>End: {new Date(plan.endDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(plan.status)}
                        <div className="text-right text-sm">
                          <div className="text-slate-900 font-medium">
                            {calculateProgress(plan)}% Complete
                          </div>
                          <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${calculateProgress(plan)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">{mockDepartments.length}</span> departments involved
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewPlanDetails(plan.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanManagement;