import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Send, 
  Calendar, 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Bell
} from 'lucide-react';
import { mockDepartments, mockPlanningRequests, mockEmployees, mockUserPermissions } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const PlanningRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockPlanningRequests);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    departmentId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    dueDate: '',
    message: ''
  });

  const userPermissions = mockUserPermissions[user?.role || 'User'];
  const canSendRequests = userPermissions.canSendRequests;

  if (!canSendRequests) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to send planning requests.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSendRequest = () => {
    const newId = Math.max(...requests.map(r => r.id)) + 1;
    const requestData = {
      id: newId,
      ...newRequest,
      departmentId: parseInt(newRequest.departmentId),
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: user?.id || 2,
      responses: []
    };

    setRequests(prev => [requestData, ...prev]);
    setNewRequest({
      departmentId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      dueDate: '',
      message: ''
    });
    setShowSendDialog(false);
    
    toast({
      title: "Request Sent",
      description: `Planning request sent to ${getDepartmentName(requestData.departmentId)} department`,
    });
  };

  const getDepartmentName = (departmentId) => {
    const dept = mockDepartments.find(d => d.id === departmentId);
    return dept?.name || 'Unknown';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      sent: 'default',
      pending: 'secondary',
      completed: 'default',
      overdue: 'destructive'
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getResponseRate = (request) => {
    const departmentEmployees = mockEmployees.filter(emp => 
      emp.departmentId === request.departmentId && 
      (emp.role === 'Creator' || emp.role === 'Approver')
    );
    const responseCount = request.responses ? request.responses.length : 0;
    const totalExpected = departmentEmployees.length;
    return totalExpected > 0 ? `${responseCount}/${totalExpected}` : '0/0';
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
              <Bell className="h-5 w-5 text-slate-600" />
              <h1 className="text-xl font-semibold text-slate-900">Planning Requests</h1>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
          </div>
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Planning Request</DialogTitle>
                <DialogDescription>
                  Send a monthly planning request to a department
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={newRequest.departmentId.toString()} 
                    onValueChange={(value) => setNewRequest({...newRequest, departmentId: value})}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Select 
                      value={newRequest.month.toString()} 
                      onValueChange={(value) => setNewRequest({...newRequest, month: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newRequest.year}
                      onChange={(e) => setNewRequest({...newRequest, year: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newRequest.dueDate}
                    onChange={(e) => setNewRequest({...newRequest, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={newRequest.message}
                    onChange={(e) => setNewRequest({...newRequest, message: e.target.value})}
                    placeholder="Enter request message..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendRequest}>
                  Send Request
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
              <CardTitle className="text-sm font-medium text-blue-700">Total Requests</CardTitle>
              <Send className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{requests.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {requests.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Overdue</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {requests.filter(r => r.status === 'overdue').length}
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
                {requests.filter(r => r.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Planning Requests</span>
            </CardTitle>
            <CardDescription>
              Manage monthly planning requests sent to departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No planning requests sent yet</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {getDepartmentName(request.departmentId)} Department
                          </h3>
                          <p className="text-sm text-slate-600">
                            {new Date(0, request.month - 1).toLocaleDateString('en-US', { month: 'long' })} {request.year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right text-sm">
                          <div className="text-slate-900 font-medium">
                            Response Rate: {getResponseRate(request)}
                          </div>
                          <div className="text-slate-600">
                            Due: {new Date(request.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    {request.message && (
                      <div className="bg-slate-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-slate-700">{request.message}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Sent on {new Date(request.sentAt).toLocaleDateString()} at {new Date(request.sentAt).toLocaleTimeString()}
                      </span>
                      {request.responses && request.responses.length > 0 && (
                        <div className="flex -space-x-2">
                          {request.responses.slice(0, 3).map((response, i) => {
                            const employee = mockEmployees.find(emp => emp.id === response.userId);
                            return (
                              <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                <AvatarImage src={employee?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {employee?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {request.responses && request.responses.length > 3 && (
                            <div className="h-6 w-6 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center text-xs">
                              +{request.responses.length - 3}
                            </div>
                          )}
                        </div>
                      )}
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

export default PlanningRequests;