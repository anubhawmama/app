import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Save,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Edit,
  Check,
  X
} from 'lucide-react';
import { mockPlanningData, mockEmployees } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const Planning = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [planningData, setPlanningData] = useState(mockPlanningData);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  };

  const handleCellClick = (employeeId, day) => {
    const key = `${employeeId}-${day}`;
    const currentValue = planningData[key] || 0;
    setEditingCell(key);
    setEditValue(currentValue.toString());
  };

  const handleCellChange = (value) => {
    setEditValue(value);
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newValue = parseInt(editValue) || 0;
      setPlanningData(prev => ({
        ...prev,
        [editingCell]: newValue
      }));
      setPendingChanges(prev => ({
        ...prev,
        [editingCell]: newValue
      }));
      setHasUnsavedChanges(true);
      setEditingCell(null);
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleSaveAll = () => {
    setShowConfirmDialog(true);
  };

  const confirmSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Planning Data Saved",
        description: `Successfully updated ${Object.keys(pendingChanges).length} entries for ${monthName}`,
      });
      
      setPendingChanges({});
      setHasUnsavedChanges(false);
      setShowConfirmDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save planning data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMonthTotal = (employeeId) => {
    return days.reduce((sum, day) => {
      const key = `${employeeId}-${day}`;
      return sum + (planningData[key] || 0);
    }, 0);
  };

  const getDayTotal = (day) => {
    return filteredEmployees.reduce((sum, emp) => {
      const key = `${emp.id}-${day}`;
      return sum + (planningData[key] || 0);
    }, 0);
  };

  const getGrandTotal = () => {
    return filteredEmployees.reduce((sum, emp) => sum + getMonthTotal(emp.id), 0);
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
              <h1 className="text-xl font-semibold text-slate-900">Planning</h1>
            </div>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={handleSaveAll} className="bg-slate-900 hover:bg-slate-800">
              <Save className="h-4 w-4 mr-2" />
              Save Changes ({Object.keys(pendingChanges).length})
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigateMonth(-1)}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold text-slate-900 min-w-48 text-center">
              {monthName}
            </h2>
            <Button
              variant="outline"
              onClick={() => navigateMonth(1)}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Hours</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{getGrandTotal()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Employees</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{filteredEmployees.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Avg per Day</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {Math.round(getGrandTotal() / daysInMonth)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Working Days</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{daysInMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Planning Grid */}
        <Card className="shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Monthly Planning Grid</span>
            </CardTitle>
            <CardDescription>
              Click on any cell to edit planning numbers. Changes will be highlighted until saved.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Grid Header */}
                <div className="bg-slate-50 border-b border-slate-200 flex">
                  <div className="w-48 p-4 font-semibold text-slate-700 border-r border-slate-200">
                    Employee
                  </div>
                  {days.map(day => (
                    <div key={day} className="w-16 p-2 text-center font-medium text-slate-600 border-r border-slate-200">
                      <div className="text-xs">{new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-sm font-bold">{day}</div>
                    </div>
                  ))}
                  <div className="w-20 p-4 text-center font-semibold text-slate-700">
                    Total
                  </div>
                </div>

                {/* Grid Rows */}
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex hover:bg-slate-50 border-b border-slate-100">
                    <div className="w-48 p-4 border-r border-slate-200">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="text-xs bg-slate-200">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{employee.name}</div>
                          <div className="text-xs text-slate-500">{employee.department}</div>
                        </div>
                      </div>
                    </div>
                    
                    {days.map(day => {
                      const key = `${employee.id}-${day}`;
                      const value = planningData[key] || 0;
                      const isEditing = editingCell === key;
                      const hasUnsavedChange = pendingChanges[key] !== undefined;
                      
                      return (
                        <div 
                          key={day} 
                          className="w-16 p-1 border-r border-slate-200 relative"
                        >
                          {isEditing ? (
                            <div className="flex flex-col space-y-1">
                              <Input
                                value={editValue}
                                onChange={(e) => handleCellChange(e.target.value)}
                                className="h-8 text-center text-xs p-1"
                                type="number"
                                min="0"
                                autoFocus
                              />
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={handleCellSave}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCellCancel}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleCellClick(employee.id, day)}
                              className={`h-10 flex items-center justify-center cursor-pointer rounded transition-colors ${
                                hasUnsavedChange 
                                  ? 'bg-blue-100 border-2 border-blue-300 text-blue-900' 
                                  : value > 0 
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-900' 
                                    : 'hover:bg-slate-100 text-slate-500'
                              }`}
                            >
                              <span className="text-sm font-medium">{value || '-'}</span>
                              {hasUnsavedChange && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="w-20 p-4 text-center">
                      <Badge variant="secondary" className="font-bold">
                        {getMonthTotal(employee.id)}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Totals Row */}
                <div className="flex bg-slate-100 border-t-2 border-slate-300">
                  <div className="w-48 p-4 font-bold text-slate-800 border-r border-slate-300">
                    Daily Totals
                  </div>
                  {days.map(day => (
                    <div key={day} className="w-16 p-4 text-center border-r border-slate-300">
                      <Badge variant="default" className="font-bold">
                        {getDayTotal(day)}
                      </Badge>
                    </div>
                  ))}
                  <div className="w-20 p-4 text-center">
                    <Badge className="font-bold bg-slate-900">
                      {getGrandTotal()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save Changes</DialogTitle>
            <DialogDescription>
              You are about to save {Object.keys(pendingChanges).length} planning entries for {monthName}.
              This will update the data on the server.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Summary of Changes:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(pendingChanges).map(([key, value]) => {
                const [employeeId, day] = key.split('-');
                const employee = mockEmployees.find(e => e.id === parseInt(employeeId));
                return (
                  <div key={key} className="text-sm text-slate-600 flex justify-between">
                    <span>{employee?.name} - Day {day}:</span>
                    <span className="font-medium">{value} hours</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave} className="bg-slate-900 hover:bg-slate-800">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planning;