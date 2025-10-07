import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import AppLayout from './AppLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ChevronDown,
  ChevronRight,
  Save,
  FileText,
  Calendar,
  User,
  Filter,
  History,
  Search,
  RefreshCw
} from 'lucide-react';
import { 
  departments, 
  brands, 
  plans, 
  planStatus,
  buildInputMatrixHierarchy,
  getPlanDataForMatrix,
  getActualDataForMatrix,
  calculateQuarterlyTotals,
  financialUsers
} from '../data/financialPlanningData';
import { LoadingSpinner } from './ui/loading';
import { toast } from '../hooks/use-toast';

const FinancialPlanning = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1'); // Q1 2025 Marketing Plan
  const [selectedDepartment, setSelectedDepartment] = useState('1'); // Marketing
  const [selectedBrand, setSelectedBrand] = useState(''); // All brands
  const [selectedMonth, setSelectedMonth] = useState(''); // All months
  const [selectedYear, setSelectedYear] = useState('2025');
  const [expandedItems, setExpandedItems] = useState(new Set(['1', '3'])); // GMV and Spend Break Ups expanded by default
  const [planningData, setPlanningData] = useState({});
  const [currentPlan, setCurrentPlan] = useState(null);
  const [hierarchyData, setHierarchyData] = useState([]);
  const [showChangelog, setShowChangelog] = useState(false);
  const [changelogData, setChangelogData] = useState([]);

  // Mock changelog data
  const mockChangelog = [
    {
      id: 1,
      user: 'John Smith',
      action: 'UPDATE',
      timestamp: '2025-01-15T10:30:00Z',
      changes: { 
        field: 'GMV - Brand Alpha - January', 
        old_value: 115000, 
        new_value: 120000 
      },
      comment: 'Updated Q1 forecast based on new market data'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      action: 'UPDATE', 
      timestamp: '2025-01-14T14:20:00Z',
      changes: { 
        field: 'Consumer Promo - Brand Beta - February', 
        old_value: 7000, 
        new_value: 7500 
      },
      comment: 'Increased promo budget for Valentine campaign'
    },
    {
      id: 3,
      user: 'Mike Chen',
      action: 'CREATE',
      timestamp: '2025-01-10T09:15:00Z', 
      changes: { 
        field: 'Plan Status', 
        old_value: null, 
        new_value: 'Draft' 
      },
      comment: 'Created Q1 2025 Marketing Plan'
    }
  ];

  useEffect(() => {
    if (selectedPlan && selectedDepartment) {
      loadPlanData(selectedPlan);
    }
  }, [selectedPlan, selectedDepartment, selectedBrand, selectedMonth, selectedYear]);

  const loadPlanData = (planId) => {
    const plan = plans.find(p => p.id === parseInt(planId));
    if (!plan) return;
    
    setCurrentPlan(plan);
    
    // Get department and build hierarchy
    const hierarchy = buildInputMatrixHierarchy(plan.department);
    setHierarchyData(hierarchy);
    setChangelogData(mockChangelog);
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId.toString())) {
      newExpanded.delete(itemId.toString());
    } else {
      newExpanded.add(itemId.toString());
    }
    setExpandedItems(newExpanded);
  };

  const handleCellEdit = (matrixId, month, brandId, value) => {
    const key = `${matrixId}-${month}-${brandId || 'null'}`;
    setPlanningData(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send planningData to your Django API
      console.log('Saving planning data:', planningData);
      
      // Add to changelog
      const newChange = {
        id: changelogData.length + 1,
        user: user?.name || 'Current User',
        action: 'UPDATE',
        timestamp: new Date().toISOString(),
        changes: { 
          field: 'Multiple Fields', 
          old_value: 'Various', 
          new_value: 'Updated' 
        },
        comment: `Saved ${Object.keys(planningData).length} planning updates`
      };
      setChangelogData(prev => [newChange, ...prev]);
      
      toast({
        title: "Success",
        description: "Plan saved successfully"
      });
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getFilteredHierarchy = () => {
    // Apply filters to hierarchy data
    return hierarchyData.filter(matrix => {
      // Brand filter
      if (selectedBrand && matrix.brands && matrix.brands.length > 0) {
        return matrix.brands.includes(parseInt(selectedBrand));
      }
      return true;
    });
  };

  const renderMatrixRow = (matrix, level = 0, parentExpanded = true) => {
    if (!parentExpanded) return null;
    
    const isExpanded = expandedItems.has(matrix.id.toString());
    const hasChildren = matrix.children && matrix.children.length > 0;
    const hasBrands = matrix.brands && matrix.brands.length > 0;
    
    const rows = [];
    
    // Main matrix row
    rows.push(
      <tr key={matrix.id} className="border-b hover:bg-gray-50">
        <td className="p-3" style={{ paddingLeft: `${level * 20 + 12}px` }}>
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(matrix.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <span className={`font-medium ${level === 0 ? 'text-gray-900' : 'text-gray-700'}`}>
              {matrix.name}
            </span>
            {matrix.is_reclass && (
              <Badge variant="secondary" className="text-xs">Reclass</Badge>
            )}
          </div>
        </td>
        <td className="p-3 text-center">-</td>
        {renderMonthlyColumns(matrix.id, null)}
        {renderQuarterlyColumns(matrix.id, null)}
      </tr>
    );

    // Brand breakdown rows (if matrix has brands and is expanded)
    if (hasBrands && isExpanded) {
      const filteredBrands = selectedBrand ? 
        matrix.brands.filter(brandId => brandId === parseInt(selectedBrand)) :
        matrix.brands;
        
      filteredBrands.forEach(brandId => {
        const brand = brands.find(b => b.id === brandId);
        if (brand) {
          rows.push(
            <tr key={`${matrix.id}-${brandId}`} className="border-b hover:bg-gray-50 bg-gray-25">
              <td className="p-3" style={{ paddingLeft: `${(level + 1) * 20 + 12}px` }}>
                <span className="text-gray-600">{brand.name}</span>
              </td>
              <td className="p-3 text-center text-gray-600">{brand.name}</td>
              {renderMonthlyColumns(matrix.id, brandId)}
              {renderQuarterlyColumns(matrix.id, brandId)}
            </tr>
          );
        }
      });
    }

    // Children rows (recursive)
    if (hasChildren && isExpanded) {
      matrix.children.forEach(child => {
        rows.push(...renderMatrixRow(child, level + 1, true));
      });
    }

    return rows;
  };

  const renderMonthlyColumns = (matrixId, brandId) => {
    const months = [1, 2, 3]; // Jan, Feb, Mar
    
    // Apply month filter
    const filteredMonths = selectedMonth ? 
      months.filter(month => month === parseInt(selectedMonth)) :
      months;
    
    if (filteredMonths.length === 0) {
      return <td colSpan="3" className="p-3 text-center text-gray-500">No data for selected month</td>;
    }
    
    return months.map(month => {
      const isVisible = filteredMonths.includes(month);
      if (!isVisible && selectedMonth) {
        return <td key={month} className="p-2 bg-gray-100"></td>;
      }
      
      const planEntry = getPlanDataForMatrix(currentPlan?.id, matrixId, month, brandId);
      const value = planEntry ? parseFloat(planEntry.planned_value) : 0;
      const key = `${matrixId}-${month}-${brandId || 'null'}`;
      const editedValue = planningData[key];
      const displayValue = editedValue !== undefined ? editedValue : value;
      
      return (
        <td key={month} className={`p-2 ${!isVisible ? 'opacity-50' : ''}`}>
          <Input
            type="number"
            value={displayValue === 0 ? '' : displayValue}
            onChange={(e) => handleCellEdit(matrixId, month, brandId, e.target.value)}
            className="w-20 h-8 text-right text-sm border-gray-200 focus:border-blue-500"
            placeholder="0"
            disabled={!isVisible}
          />
        </td>
      );
    });
  };

  const renderQuarterlyColumns = (matrixId, brandId) => {
    // Q1 PLAN - sum of planned values for Jan, Feb, Mar
    const q1Planned = calculateQuarterlyTotals(currentPlan?.id, matrixId, brandId, false);
    
    // Q1 ACTUAL - sum of actual values for Jan, Feb, Mar
    const q1Actual = calculateQuarterlyTotals(currentPlan?.id, matrixId, brandId, true, currentPlan?.department);
    
    return (
      <>
        <td className="p-3 text-right font-medium bg-blue-50">
          {q1Planned > 0 ? q1Planned.toLocaleString() : '0'}
        </td>
        <td className="p-3 text-right font-medium bg-green-50 text-blue-600">
          {q1Actual > 0 ? q1Actual.toLocaleString() : '0'}
        </td>
      </>
    );
  };

  const renderChangelog = () => (
    <Dialog open={showChangelog} onOpenChange={setShowChangelog}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Planning Changelog</span>
            </div>
            <Badge variant="outline">
              {changelogData.length} {changelogData.length === 1 ? 'Change' : 'Changes'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Track all changes made to this planning data - sorted by most recent first
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {changelogData.length > 0 ? (
            changelogData
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((change, index) => (
                <div key={change.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant={
                        change.action === 'CREATE' ? 'default' : 
                        change.action === 'UPDATE' ? 'secondary' : 
                        'destructive'
                      }>
                        {change.action}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{change.user}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(change.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(change.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-3 mb-3">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      <strong>Field Updated:</strong> {change.changes.field}
                    </div>
                    
                    {change.changes.old_value !== null && change.action === 'UPDATE' && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Previous Value:</span>
                          <div className="font-mono bg-red-50 text-red-700 px-2 py-1 rounded mt-1">
                            {change.changes.old_value?.toLocaleString?.() || change.changes.old_value || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">New Value:</span>
                          <div className="font-mono bg-green-50 text-green-700 px-2 py-1 rounded mt-1">
                            {change.changes.new_value?.toLocaleString?.() || change.changes.new_value || 'N/A'}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {change.action === 'CREATE' && (
                      <div className="text-sm">
                        <span className="text-gray-600">Initial Value:</span>
                        <div className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                          {change.changes.new_value?.toLocaleString?.() || change.changes.new_value || 'N/A'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {change.comment && (
                    <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
                      <div className="text-sm text-gray-600 mb-1 font-medium">Comment:</div>
                      <div className="text-sm text-blue-800 italic">
                        "{change.comment}"
                      </div>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No changes recorded yet</p>
              <p className="text-sm text-gray-400">Changes will appear here when you make updates to the planning data</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setShowChangelog(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!currentPlan) {
    return (
      <AppLayout title="Financial Planning" subtitle="Loading...">
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No plan selected</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const currentDepartment = departments.find(d => d.id === currentPlan.department);
  const currentStatus = planStatus.find(s => s.id === currentPlan.status);
  const filteredHierarchy = getFilteredHierarchy();

  return (
    <AppLayout 
      title="Financial Planning" 
      subtitle={currentPlan ? `${currentPlan.name} - ${currentDepartment?.name}` : "Loading..."}
    >
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
            <CardDescription>
              Filter planning data by department, brand, plan, month and year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.filter(p => p.department === parseInt(selectedDepartment)).map(plan => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Status and Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentPlan.name}</span>
              <Badge 
                variant={currentStatus?.name === 'Draft' ? 'secondary' : 'default'}
                className="text-sm"
              >
                {currentStatus?.name || 'Draft'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Department: {currentDepartment?.name} | Year: {currentPlan.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Created by: {financialUsers.find(u => u.id === currentPlan.created_by)?.first_name} {financialUsers.find(u => u.id === currentPlan.created_by)?.last_name}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setChangelogData(mockChangelog);
                    setShowChangelog(true);
                  }}
                >
                  <History className="w-4 h-4 mr-2" />
                  Changelog ({mockChangelog.length})
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      loadPlanData(selectedPlan);
                      setLoading(false);
                      toast({
                        title: "Data Refreshed",
                        description: "Planning data has been refreshed successfully."
                      });
                    }, 1000);
                  }}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={savePlan} 
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Grid */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-medium text-gray-700 min-w-64">METRIC</th>
                  <th className="text-center p-4 font-medium text-gray-700 w-32">BRAND</th>
                  <th className="text-center p-4 font-medium text-gray-700 w-24">JAN</th>
                  <th className="text-center p-4 font-medium text-gray-700 w-24">FEB</th>
                  <th className="text-center p-4 font-medium text-gray-700 w-24">MAR</th>
                  <th className="text-center p-4 font-medium text-gray-700 w-32 bg-blue-50">Q1 PLAN</th>
                  <th className="text-center p-4 font-medium text-gray-700 w-32 bg-green-50">Q1 ACTUAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredHierarchy.length > 0 ? (
                  filteredHierarchy.map(matrix => renderMatrixRow(matrix))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No data available for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

        {/* Changelog Dialog */}
        {renderChangelog()}
      </div>
    </AppLayout>
  );
};

export default FinancialPlanning;