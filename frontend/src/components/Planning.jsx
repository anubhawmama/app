import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
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
  X,
  History,
  Filter,
  Eye,
  Lock,
  Unlock,
  Clock,
  User,
  Building,
  ChevronDown
} from 'lucide-react';
import { mockSkuPlanningData as mockPlanningData, mockEmployees, mockPlanningHistory, mockUserPermissions } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const Planning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [planningData, setPlanningData] = useState(mockPlanningData);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [planningHistory, setPlanningHistory] = useState(mockPlanningHistory);
  const [selectedHistoryCell, setSelectedHistoryCell] = useState(null);
  
  // Filter states
  const [viewMode, setViewMode] = useState('monthly'); // yearly, quarterly, monthly
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [userPermissions, setUserPermissions] = useState(mockUserPermissions[user?.role || 'User']);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get days based on view mode
  const getDaysForView = () => {
    switch (viewMode) {
      case 'yearly':
        return Array.from({ length: 12 }, (_, i) => i + 1); // Months
      case 'quarterly':
        const quarter = Math.floor(currentMonth / 3);
        const startMonth = quarter * 3;
        return Array.from({ length: 3 }, (_, i) => startMonth + i + 1); // Quarter months
      default:
        return Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1);
    }
  };

  const days = getDaysForView();

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    const matchesEntity = selectedEntity === 'all' || emp.entity === selectedEntity;
    return matchesSearch && matchesDepartment && matchesEntity;
  });

  const departments = [...new Set(mockEmployees.map(emp => emp.department))];
  const entities = [...new Set(mockEmployees.map(emp => emp.entity || 'Main'))];

  const navigateTime = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'yearly':
        newDate.setFullYear(currentYear + direction);
        break;
      case 'quarterly':
        newDate.setMonth(currentMonth + (direction * 3));
        break;
      default:
        newDate.setMonth(currentMonth + direction);
    }
    setCurrentDate(newDate);
  };

  const canEditCell = (employeeId, day) => {
    if (!userPermissions.canEdit) return false;
    if (userPermissions.role === 'Admin') return true;
    
    // Managers can only edit their department's data
    if (userPermissions.role === 'Manager') {
      const employee = mockEmployees.find(e => e.id === employeeId);
      return employee && userPermissions.departments?.includes(employee.department);
    }
    
    return false;
  };

  const handleCellClick = (employeeId, day) => {
    if (!canEditCell(employeeId, day)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit this data.",
        variant: "destructive"
      });
      return;
    }

    const key = `${employeeId}-${day}`;
    const planningEntry = planningData[key];
    const currentValue = planningEntry ? (planningEntry.planned || planningEntry.actual || 0) : 0;
    setEditingCell(key);
    setEditValue(currentValue.toString());
  };

  const handleCellChange = (value) => {
    setEditValue(value);
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newValue = parseInt(editValue) || 0;
      const planningEntry = planningData[editingCell];
      const oldValue = planningEntry ? (planningEntry.planned || planningEntry.actual || 0) : 0;
      
      setPlanningData(prev => ({
        ...prev,
        [editingCell]: {
          planned: newValue,
          actual: oldValue,
          status: 'pending',
          submittedBy: user?.id || 1,
          submittedAt: new Date().toISOString()
        }
      }));
      
      setPendingChanges(prev => ({
        ...prev,
        [editingCell]: {
          planned: newValue,
          actual: oldValue,
          status: 'pending',
          submittedBy: user?.id || 1,
          submittedAt: new Date().toISOString()
        }
      }));
      
      // Add to history
      const [employeeId, day] = editingCell.split('-');
      const employee = mockEmployees.find(e => e.id === parseInt(employeeId));
      const historyEntry = {
        id: Date.now(),
        employeeId: parseInt(employeeId),
        employeeName: employee?.name || 'Unknown',
        day: parseInt(day),
        month: currentMonth + 1,
        year: currentYear,
        oldValue,
        newValue,
        changedBy: user?.name || 'Current User',
        changedAt: new Date().toISOString(),
        reason: 'Manual update'
      };
      
      setPlanningHistory(prev => [historyEntry, ...prev]);
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

  const viewCellHistory = (employeeId, day) => {
    const cellHistory = planningHistory.filter(h => 
      h.employeeId === employeeId && 
      h.day === day && 
      h.month === currentMonth + 1 && 
      h.year === currentYear
    );
    setSelectedHistoryCell({ employeeId, day, history: cellHistory });
    setShowHistoryDialog(true);
  };

  const getMonthTotal = (employeeId) => {
    return days.reduce((sum, day) => {
      const key = `${employeeId}-${day}`;
      const planningEntry = planningData[key];
      return sum + (planningEntry ? (planningEntry.planned || planningEntry.actual || 0) : 0);
    }, 0);
  };

  const getDayTotal = (day) => {
    return filteredEmployees.reduce((sum, emp) => {
      const key = `${emp.id}-${day}`;
      const planningEntry = planningData[key];
      return sum + (planningEntry ? (planningEntry.planned || planningEntry.actual || 0) : 0);
    }, 0);
  };

  const getGrandTotal = () => {
    return filteredEmployees.reduce((sum, emp) => sum + getMonthTotal(emp.id), 0);
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'yearly':
        return currentYear.toString();
      case 'quarterly':
        const quarter = Math.floor(currentMonth / 3) + 1;
        return `Q${quarter} ${currentYear}`;
      default:
        return monthName;
    }
  };

  const getColumnHeader = (day) => {
    switch (viewMode) {
      case 'yearly':
        return new Date(currentYear, day - 1).toLocaleDateString('en-US', { month: 'short' });
      case 'quarterly':
        return new Date(currentYear, day - 1).toLocaleDateString('en-US', { month: 'short' });
      default:
        return {
          weekday: new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'short' }),
          day: day
        };
    }
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
              <Badge variant="outline">{userPermissions.role}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowHistoryDialog(true)}
              className="text-slate-600"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSaveAll} className="bg-slate-900 hover:bg-slate-800">
                <Save className="h-4 w-4 mr-2" />
                Save Changes ({Object.keys(pendingChanges).length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters and Controls */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* View Mode Selector */}
            <Card className="p-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">View Mode</Label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            {/* Time Navigation */}
            <Card className="p-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Period</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTime(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-32 text-center">
                  {getViewTitle()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTime(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Department Filter */}
            <Card className="p-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Entity Filter */}
            <Card className="p-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Entity</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Search */}
            <Card className="p-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Permission Notice */}
        {!userPermissions.canEdit && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  You have read-only access to planning data. Contact your administrator for edit permissions.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

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
              <CardTitle className="text-sm font-medium text-purple-700">Avg per {viewMode === 'monthly' ? 'Day' : 'Period'}</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {Math.round(getGrandTotal() / days.length)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Periods</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{days.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Planning Grid */}
        <Card className="shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{getViewTitle()} Planning Grid</span>
              <Badge variant="secondary">{viewMode}</Badge>
            </CardTitle>
            <CardDescription>
              {userPermissions.canEdit 
                ? "Click on any cell to edit planning numbers. Changes will be highlighted until saved."
                : "View-only access to planning data."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Grid Header */}
                <div className="bg-slate-50 border-b border-slate-200 flex sticky top-0 z-10">
                  <div className="w-48 p-4 font-semibold text-slate-700 border-r border-slate-200">
                    Employee
                  </div>
                  {days.map(day => {
                    const header = getColumnHeader(day);
                    return (
                      <div key={day} className="w-16 p-2 text-center font-medium text-slate-600 border-r border-slate-200">
                        {viewMode === 'monthly' ? (
                          <>
                            <div className="text-xs">{header.weekday}</div>
                            <div className="text-sm font-bold">{header.day}</div>
                          </>
                        ) : (
                          <div className="text-sm font-bold">{header}</div>
                        )}
                      </div>
                    );
                  })}
                  <div className="w-20 p-4 text-center font-semibold text-slate-700">
                    Total
                  </div>
                  <div className="w-16 p-4 text-center font-semibold text-slate-700">
                    Actions
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
                          <div className="text-xs text-slate-500 flex items-center space-x-2">
                            <span>{employee.department}</span>
                            {employee.entity && (
                              <>
                                <span>•</span>
                                <span>{employee.entity}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {days.map(day => {
                      const key = `${employee.id}-${day}`;
                      const planningEntry = planningData[key];
                      const value = planningEntry ? (planningEntry.planned || planningEntry.actual || 0) : 0;
                      const isEditing = editingCell === key;
                      const hasUnsavedChange = pendingChanges[key] !== undefined;
                      const canEdit = canEditCell(employee.id, day);
                      
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
                              onClick={() => canEdit && handleCellClick(employee.id, day)}
                              className={`h-10 flex items-center justify-center rounded transition-colors relative ${
                                !canEdit 
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                  : hasUnsavedChange 
                                    ? 'bg-blue-100 border-2 border-blue-300 text-blue-900 cursor-pointer' 
                                    : value > 0 
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer' 
                                      : 'hover:bg-slate-100 text-slate-500 cursor-pointer'
                              }`}
                            >
                              <span className="text-sm font-medium">{value || '-'}</span>
                              {!canEdit && (
                                <Lock className="absolute top-1 right-1 w-2 h-2 text-slate-400" />
                              )}
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

                    <div className="w-16 p-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewCellHistory(employee.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <History className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Totals Row */}
                <div className="flex bg-slate-100 border-t-2 border-slate-300 sticky bottom-0">
                  <div className="w-48 p-4 font-bold text-slate-800 border-r border-slate-300">
                    {viewMode === 'monthly' ? 'Daily' : 'Period'} Totals
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
                  <div className="w-16 p-4"></div>
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
              You are about to save {Object.keys(pendingChanges).length} planning entries for {getViewTitle()}.
              This will update the data on the server.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <h4 className="font-medium text-slate-900 mb-2">Summary of Changes:</h4>
            <div className="space-y-1">
              {Object.entries(pendingChanges).map(([key, value]) => {
                const [employeeId, day] = key.split('-');
                const employee = mockEmployees.find(e => e.id === parseInt(employeeId));
                return (
                  <div key={key} className="text-sm text-slate-600 flex justify-between">
                    <span>{employee?.name} - {viewMode === 'monthly' ? `Day ${day}` : `Period ${day}`}:</span>
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

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Planning History</span>
            </DialogTitle>
            <DialogDescription>
              Recent changes to planning data for {getViewTitle()}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {planningHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No history records found
              </div>
            ) : (
              <div className="space-y-2">
                {planningHistory.slice(0, 50).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {record.employeeName} - {viewMode === 'monthly' ? `Day ${record.day}` : `Period ${record.day}`}
                        </div>
                        <div className="text-xs text-slate-500">
                          Changed by {record.changedBy} • {new Date(record.changedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-red-600">{record.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span className="text-green-600">{record.newValue}</span>
                      </div>
                      <div className="text-xs text-slate-500">hours</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planning;