import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  ChevronDown,
  ChevronRight,
  Save,
  FileText,
  Building,
  Calendar,
  User,
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
import { PageLoader, LoadingSpinner } from './ui/loading';
import { toast } from '../hooks/use-toast';

const FinancialPlanning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1'); // Q1 2025 Marketing Plan
  const [expandedItems, setExpandedItems] = useState(new Set(['1', '3'])); // GMV and Spend Break Ups expanded by default
  const [planningData, setPlanningData] = useState({});
  const [currentPlan, setCurrentPlan] = useState(null);
  const [hierarchyData, setHierarchyData] = useState([]);

  useEffect(() => {
    initializePlanning();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      loadPlanData(selectedPlan);
    }
  }, [selectedPlan]);

  const initializePlanning = async () => {
    setLoading(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Financial Planning loaded successfully"
      });
    } catch (error) {
      console.error('Error initializing planning:', error);
      toast({
        title: "Error",
        description: "Failed to load planning data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPlanData = (planId) => {
    const plan = plans.find(p => p.id === parseInt(planId));
    if (!plan) return;
    
    setCurrentPlan(plan);
    
    // Get department and build hierarchy
    const hierarchy = buildInputMatrixHierarchy(plan.department);
    setHierarchyData(hierarchy);
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
      matrix.brands.forEach(brandId => {
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
    const monthNames = ['JAN', 'FEB', 'MAR'];
    
    return months.map(month => {
      const planEntry = getPlanDataForMatrix(currentPlan?.id, matrixId, month, brandId);
      const value = planEntry ? parseFloat(planEntry.planned_value) : 0;
      const key = `${matrixId}-${month}-${brandId || 'null'}`;
      const editedValue = planningData[key];
      const displayValue = editedValue !== undefined ? editedValue : value;
      
      return (
        <td key={month} className="p-2">
          <Input
            type="number"
            value={displayValue === 0 ? '' : displayValue}
            onChange={(e) => handleCellEdit(matrixId, month, brandId, e.target.value)}
            className="w-20 h-8 text-right text-sm border-gray-200 focus:border-blue-500"
            placeholder="0"
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

  if (loading) {
    return <PageLoader message="Loading Financial Planning..." />;
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No plan selected</p>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDepartment = departments.find(d => d.id === currentPlan.department);
  const currentStatus = planStatus.find(s => s.id === currentPlan.status);

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
                <h1 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h1>
                <p className="text-sm text-gray-600">
                  Department: {currentDepartment?.name} | Year: {currentPlan.year}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={currentStatus?.name === 'Draft' ? 'secondary' : 'default'}
                className="text-sm"
              >
                {currentStatus?.name || 'Draft'}
              </Badge>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Plan Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label>Select Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map(plan => {
                      const dept = departments.find(d => d.id === plan.department);
                      const status = planStatus.find(s => s.id === plan.status);
                      return (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-xs text-gray-500">
                              {dept?.name} - {plan.year} ({status?.name})
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => loadPlanData(selectedPlan)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  {hierarchyData.map(matrix => renderMatrixRow(matrix))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Building className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Department</div>
                  <div className="font-semibold">{currentDepartment?.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-sm text-gray-600">Planning Period</div>
                  <div className="font-semibold">Q1 {currentPlan.year}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Created By</div>
                  <div className="font-semibold">
                    {financialUsers.find(u => u.id === currentPlan.created_by)?.first_name} {financialUsers.find(u => u.id === currentPlan.created_by)?.last_name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanning;