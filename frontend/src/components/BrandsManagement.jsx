import React, { useState, useEffect } from 'react';
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
  Save,
  X,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import brandsApi, { validateBrandData, formatBrandForDisplay } from '../services/brandsApi';
import { toast } from '../hooks/use-toast';

const BrandsManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_name: '',
    sap_division_code: '',
    article_type: '',
    merchandise_code: ''
  });
  const [formErrors, setFormErrors] = useState([]);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await brandsApi.getBrands();
      const formattedBrands = data.map(formatBrandForDisplay);
      setBrands(formattedBrands);
      toast({
        title: "Success",
        description: `Loaded ${formattedBrands.length} brands successfully`
      });
    } catch (error) {
      console.error('Error loading brands:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      // Fallback to empty array on error
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_name: '',
      sap_division_code: '',
      article_type: '',
      merchandise_code: ''
    });
    setFormErrors([]);
    setEditingBrand(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      description: brand.description,
      short_name: brand.short_name,
      sap_division_code: brand.sap_division_code,
      article_type: brand.article_type,
      merchandise_code: brand.merchandise_code
    });
    setEditingBrand(brand);
    setFormErrors([]);
    setShowEditDialog(true);
  };

  const handleSave = async () => {
    const errors = validateBrandData(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (editingBrand) {
        // Update existing brand
        const updatedBrand = await brandsApi.updateBrand(editingBrand.brand_id, formData);
        const formattedBrand = formatBrandForDisplay(updatedBrand);
        
        setBrands(prev => prev.map(brand => 
          brand.brand_id === editingBrand.brand_id ? formattedBrand : brand
        ));
        
        toast({
          title: "Success",
          description: "Brand updated successfully"
        });
        setShowEditDialog(false);
      } else {
        // Create new brand
        const newBrand = await brandsApi.createBrand(formData);
        const formattedBrand = formatBrandForDisplay(newBrand);
        
        setBrands(prev => [...prev, formattedBrand]);
        
        toast({
          title: "Success",
          description: "Brand created successfully"
        });
        setShowAddDialog(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      return;
    }

    try {
      await brandsApi.deleteBrand(brand.brand_id);
      setBrands(prev => prev.filter(b => b.brand_id !== brand.brand_id));
      
      toast({
        title: "Success",
        description: "Brand deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.sap_division_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.article_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.merchandise_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BrandFormDialog = ({ open, onOpenChange, title, description }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-red-800 font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter brand name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_name">Short Name *</Label>
            <Input
              id="short_name"
              value={formData.short_name}
              onChange={(e) => handleInputChange('short_name', e.target.value)}
              placeholder="Enter short name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sap_division_code">SAP Division Code *</Label>
            <Input
              id="sap_division_code"
              value={formData.sap_division_code}
              onChange={(e) => handleInputChange('sap_division_code', e.target.value)}
              placeholder="Enter SAP division code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article_type">Article Type *</Label>
            <Input
              id="article_type"
              value={formData.article_type}
              onChange={(e) => handleInputChange('article_type', e.target.value)}
              placeholder="Enter article type"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchandise_code">Merchandise Code *</Label>
            <Input
              id="merchandise_code"
              value={formData.merchandise_code}
              onChange={(e) => handleInputChange('merchandise_code', e.target.value)}
              placeholder="Enter merchandise code"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter brand description (optional)"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {editingBrand ? 'Update' : 'Create'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading brands...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brands Management</h2>
          <p className="text-gray-600">Manage your brand catalog with API integration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadBrands} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Search and stats */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredBrands.length} of {brands.length} brands
        </Badge>
      </div>

      {/* Brands grid */}
      {filteredBrands.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No brands found matching your search' : 'No brands available'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Brand
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-medium text-gray-700">Brand ID</th>
                <th className="text-left p-4 font-medium text-gray-700">Name</th>
                <th className="text-left p-4 font-medium text-gray-700">Short Name</th>
                <th className="text-left p-4 font-medium text-gray-700">SAP Division</th>
                <th className="text-left p-4 font-medium text-gray-700">Article Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Merchandise Code</th>
                <th className="text-left p-4 font-medium text-gray-700">Description</th>
                <th className="text-center p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand, index) => (
                <tr key={brand.brand_id || index} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Badge variant="outline">{brand.brand_id}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{brand.name}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{brand.short_name}</Badge>
                  </td>
                  <td className="p-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {brand.sap_division_code}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{brand.article_type}</span>
                  </td>
                  <td className="p-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {brand.merchandise_code}
                    </code>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-gray-600 text-sm truncate" title={brand.description}>
                      {brand.description || '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(brand)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Brand Dialog */}
      <BrandFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Add New Brand"
        description="Create a new brand in your catalog with all required information."
      />

      {/* Edit Brand Dialog */}
      <BrandFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Brand"
        description="Update brand information and save changes."
      />
    </div>
  );
};

export default BrandsManagement;