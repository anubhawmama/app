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
  ChevronDown,
  ChevronRight,
  Search, 
  Save,
  Calendar,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Edit,
  Check,
  X,
  History,
  Filter,
  Eye,
  Building,
  Package,
  ChevronUp,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { mockHierarchicalPlanningData, mockPlanningWorkflow, consolidateDataByBrand, consolidateDataByCategory, consolidateDataByDepartment } from '../data/mockPlanningData';
import { mockPlans } from '../data/mockData';
import { mockDepartments, mockBrands, mockCategories, mockSubcategories, mockProducts, mockUserPermissions } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const EnhancedPlanning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedView, setSelectedView] = useState('brand'); // brand, category, product
  const [selectedMonth, setSelectedMonth] = useState('apr'); // Current month for editing
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [planningData, setPlanningData] = useState({});
  const [loading, setLoading] = useState(false);

  // Get user permissions
  const userPermissions = mockUserPermissions[user?.role] || {};
  const canEditAll = user?.role === 'SuperAdmin' || user?.role === 'Admin';
  const canEdit = canEditAll || user?.role === 'Creator';
  const userDepartmentId = user?.departmentId;

  // Available months for planning
  const months = [
    { value: 'jan', label: 'January', disabled: true },
    { value: 'feb', label: 'February', disabled: true },
    { value: 'mar', label: 'March', disabled: true },
    { value: 'apr', label: 'April', disabled: false },
    { value: 'may', label: 'May', disabled: false },
    { value: 'jun', label: 'June', disabled: false }
  ];

  useEffect(() => {
    // Auto-select user's department if they're not admin
    if (!canEditAll && userDepartmentId) {
      setSelectedDepartment(userDepartmentId.toString());
    }
    
    // Auto-select first active plan
    if (mockPlans.length > 0) {
      const activePlan = mockPlans.find(p => p.status === 'in-progress') || mockPlans[0];
      setSelectedPlan(activePlan.id.toString());
    }
  }, [canEditAll, userDepartmentId]);

  useEffect(() => {
    loadPlanningData();
  }, [selectedPlan, selectedDepartment]);

  const loadPlanningData = () => {
    if (!selectedPlan || !selectedDepartment) return;
    
    setLoading(true);
    // Load monthly planning data for selected plan and department
    const data = mockHierarchicalPlanningData.monthlyPlanningData;
    const filteredData = {};
    
    Object.keys(data).forEach(key => {
      if (key.startsWith(`${selectedPlan}-${selectedDepartment}-`)) {
        filteredData[key] = data[key];
      }
    });
    
    setPlanningData(filteredData);
    setLoading(false);
  };

  const getAssignedBrands = () => {
    if (!selectedDepartment) return [];
    const assignments = mockHierarchicalPlanningData.departmentAssignments[selectedDepartment];
    if (!assignments) return [];
    
    return mockBrands.filter(brand => assignments.brands.includes(brand.id));
  };

  const getAssignedProducts = (brandId = null) => {
    if (!selectedDepartment) return [];
    const assignments = mockHierarchicalPlanningData.departmentAssignments[selectedDepartment];
    if (!assignments) return [];
    
    let products = mockProducts.filter(product => assignments.products.includes(product.id));
    
    if (brandId) {
      products = products.filter(product => product.brandId === brandId);
    }
    
    return products;
  };

  const getProductsByBrand = (brandId) => {
    return getAssignedProducts(brandId);
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleCellEdit = (key, month, field) => {
    if (!canEdit) return;
    
    const currentValue = planningData[key]?.[month]?.[field] || 0;
    setEditingCell(`${key}-${month}-${field}`);
    setEditValue(currentValue.toString());
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    
    const [key, month, field] = editingCell.split('-');
    const numericValue = parseFloat(editValue) || 0;
    
    // Update local state
    const updatedData = { ...planningData };
    if (!updatedData[key]) updatedData[key] = {};
    if (!updatedData[key][month]) updatedData[key][month] = {};
    
    updatedData[key][month] = {
      ...updatedData[key][month],
      [field]: numericValue,
      status: field === 'actual' && numericValue > 0 ? 'completed' : 'pending',
      lastUpdated: new Date().toISOString(),
      updatedBy: user?.name
    };
    
    setPlanningData(updatedData);
    
    // Track pending changes
    const changeKey = `${key}-${month}`;
    setPendingChanges(prev => ({
      ...prev,
      [changeKey]: updatedData[key][month]
    }));
    
    setEditingCell(null);
    setEditValue('');
    
    toast({
      title: "Success",
      description: `${field === 'actual' ? 'Actual' : 'Planned'} value updated successfully`
    });
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const savePendingChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast({
        title: "Info",
        description: "No changes to save"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear pending changes
    setPendingChanges({});
    
    toast({
      title: "Success",
      description: `${Object.keys(pendingChanges).length} changes saved successfully`
    });
    
    setLoading(false);
  };

  const renderBrandView = () => {
    const assignedBrands = getAssignedBrands();
    
    return (
      <div className="space-y-4">
        {assignedBrands.map(brand => {
          const products = getProductsByBrand(brand.id);
          const isExpanded = expandedItems.has(`brand-${brand.id}`);
          const brandTotals = consolidateDataByBrand(selectedPlan, selectedDepartment, brand.id);
          
          return (
            <Card key={brand.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(`brand-${brand.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <CardDescription>{products.length} products assigned</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">Completion: {brandTotals.completion.toFixed(1)}%</div>
                      <div className={`text-sm ${brandTotals.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Variance: {brandTotals.variance > 0 ? '+' : ''}{brandTotals.variance}
                      </div>
                    </div>
                    <Badge variant={brandTotals.completion >= 100 ? 'default' : brandTotals.completion >= 50 ? 'secondary' : 'destructive'}>
                      {brandTotals.completion >= 100 ? 'On Track' : brandTotals.completion >= 50 ? 'In Progress' : 'Behind'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Product</th>
                          <th className="text-left p-3 font-medium">Category</th>
                          {months.map(month => (
                            <th key={month.value} className="text-center p-3 font-medium min-w-24">
                              {month.label}
                              <div className="text-xs text-gray-500 font-normal">
                                {month.disabled ? 'Completed' : 'Pending'}
                              </div>
                            </th>
                          ))}
                          <th className="text-center p-3 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const key = `${selectedPlan}-${selectedDepartment}-${brand.id}-${product.id}`;
                          const productData = planningData[key] || {};
                          
                          return (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">EAN: {product.eanCode}</div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="text-sm">
                                  {mockCategories.find(c => c.id === product.categoryId)?.name}
                                </div>
                              </td>
                              {months.map(month => {
                                const monthData = productData[month.value] || { planned: 0, actual: 0, status: 'pending' };
                                const isEditing = editingCell === `${key}-${month.value}-actual`;
                                
                                return (
                                  <td key={month.value} className="p-2 text-center">
                                    <div className="space-y-1">
                                      {/* Planned Value */}
                                      <div className="text-xs text-gray-600">
                                        Target: {monthData.planned}
                                      </div>
                                      
                                      {/* Actual Value */}
                                      <div className="relative">
                                        {isEditing ? (
                                          <div className="flex items-center space-x-1">
                                            <Input
                                              type="number"
                                              value={editValue}
                                              onChange={(e) => setEditValue(e.target.value)}
                                              className="w-16 h-8 text-xs text-center"
                                              autoFocus
                                            />
                                            <Button size="sm" className="h-6 w-6 p-0" onClick={handleCellSave}>
                                              <Check className="w-3 h-3" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCellCancel}>
                                              <X className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <div
                                            className={`cursor-pointer px-2 py-1 rounded text-sm font-medium ${
                                              canEdit && !month.disabled ? 'hover:bg-blue-50 hover:text-blue-600' : ''
                                            } ${
                                              monthData.actual > 0 ? 
                                                monthData.actual >= monthData.planned ? 'text-green-600' : 'text-orange-600'
                                                : 'text-gray-400'
                                            }`}
                                            onClick={() => canEdit && !month.disabled && handleCellEdit(key, month.value, 'actual')}
                                          >
                                            {monthData.actual || '-'}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Status indicator */}
                                      <div className="flex justify-center">
                                        {monthData.status === 'completed' && (
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                        )}
                                        {monthData.status === 'pending' && !month.disabled && (
                                          <Clock className="w-3 h-3 text-orange-500" />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="p-3 text-center">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {Object.values(productData).reduce((sum, month) => sum + (month.actual || 0), 0)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    / {Object.values(productData).reduce((sum, month) => sum + (month.planned || 0), 0)}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderConsolidatedView = () => {
    const departmentTotals = consolidateDataByDepartment(selectedPlan, selectedDepartment);
    const assignedBrands = getAssignedBrands();
    
    return (
      <div className="space-y-6">
        {/* Department Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Department Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{departmentTotals.planned?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{departmentTotals.actual?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Actual</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${departmentTotals.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {departmentTotals.variance > 0 ? '+' : ''}{departmentTotals.variance?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Variance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{departmentTotals.completion?.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Level Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Brand</th>
                    <th className="text-center p-3 font-medium">Products</th>
                    <th className="text-center p-3 font-medium">Planned</th>
                    <th className="text-center p-3 font-medium">Actual</th>
                    <th className="text-center p-3 font-medium">Variance</th>
                    <th className="text-center p-3 font-medium">Completion</th>
                    <th className="text-center p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedBrands.map(brand => {
                    const brandTotals = consolidateDataByBrand(selectedPlan, selectedDepartment, brand.id);
                    const productCount = getProductsByBrand(brand.id).length;
                    
                    return (
                      <tr key={brand.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-sm text-gray-500">{brand.code}</div>
                        </td>
                        <td className="p-3 text-center">{productCount}</td>
                        <td className="p-3 text-center font-medium">{brandTotals.planned?.toLocaleString()}</td>
                        <td className="p-3 text-center font-medium">{brandTotals.actual?.toLocaleString()}</td>
                        <td className={`p-3 text-center font-medium ${brandTotals.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {brandTotals.variance > 0 ? '+' : ''}{brandTotals.variance?.toLocaleString()}
                        </td>
                        <td className="p-3 text-center font-medium">{brandTotals.completion?.toFixed(1)}%</td>
                        <td className="p-3 text-center">
                          <Badge variant={brandTotals.completion >= 100 ? 'default' : brandTotals.completion >= 50 ? 'secondary' : 'destructive'}>
                            {brandTotals.completion >= 100 ? 'On Track' : brandTotals.completion >= 50 ? 'In Progress' : 'Behind'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!selectedPlan || (!canEditAll && !selectedDepartment)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Please select a plan to begin planning</p>
              <Button onClick={() => navigate('/plan-management')}>
                Go to Plan Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPlanDetails = mockPlans.find(p => p.id.toString() === selectedPlan);
  const selectedDepartmentDetails = mockDepartments.find(d => d.id.toString() === selectedDepartment);
  const workflowStatus = mockPlanningWorkflow[`${selectedPlan}-${selectedDepartment}`];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enhanced Planning</h1>
                <p className="text-sm text-gray-600">Product-based planning with hierarchical structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {Object.keys(pendingChanges).length > 0 && (
                <Badge variant="secondary">
                  {Object.keys(pendingChanges).length} pending changes
                </Badge>
              )}
              <Button onClick={savePendingChanges} disabled={loading || Object.keys(pendingChanges).length === 0}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Planning Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label>Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-xs text-gray-500">{plan.status}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {canEditAll && (
                <div>
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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
              )}

              <div>
                <Label>View Type</Label>
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">Brand View</SelectItem>
                    <SelectItem value="consolidated">Consolidated View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Actions</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={loadPlanningData}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planning Status */}
        {selectedPlanDetails && selectedDepartmentDetails && workflowStatus && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-medium">{selectedPlanDetails.name}</div>
                    <div className="text-sm text-gray-600">{selectedDepartmentDetails.name}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{workflowStatus.submittedMonths.length}</div>
                  <div className="text-sm text-gray-600">Months Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{workflowStatus.pendingMonths.length}</div>
                  <div className="text-sm text-gray-600">Months Pending</div>
                </div>
                <div className="text-center">
                  <Badge variant={workflowStatus.status === 'completed' ? 'default' : 'secondary'}>
                    {workflowStatus.status}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planning Data */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading planning data...</p>
              </div>
            </CardContent>
          </Card>
        ) : selectedView === 'consolidated' ? (
          renderConsolidatedView()
        ) : (
          renderBrandView()
        )}
      </div>
    </div>
  );
};

export default EnhancedPlanning;