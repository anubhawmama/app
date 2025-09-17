// Brands API service
// Note: Update the BASE_URL when ready to connect to your actual API
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://your-api.com/api';

// API configuration
const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    // Add authentication headers here when needed
    // 'Authorization': 'Bearer your-token',
    // 'X-API-Key': 'your-api-key'
  }
};

class BrandsApiService {
  // GET: Fetch all brands
  async getBrands() {
    try {
      const response = await fetch(`${BASE_URL}/brands`, {
        method: 'GET',
        ...API_CONFIG
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      // If API returns direct array: return data
      // If API returns wrapped response: return data.data or data.brands
      return Array.isArray(data) ? data : (data.data || data.brands || []);
      
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw new Error('Failed to fetch brands. Please check your connection and try again.');
    }
  }

  // POST: Create new brand
  async createBrand(brandData) {
    try {
      const response = await fetch(`${BASE_URL}/brands`, {
        method: 'POST',
        ...API_CONFIG,
        body: JSON.stringify(brandData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error creating brand:', error);
      throw new Error('Failed to create brand. Please check your input and try again.');
    }
  }

  // PUT: Update existing brand
  async updateBrand(brandId, brandData) {
    try {
      const response = await fetch(`${BASE_URL}/brands/${brandId}`, {
        method: 'PUT',
        ...API_CONFIG,
        body: JSON.stringify(brandData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error updating brand:', error);
      throw new Error('Failed to update brand. Please check your input and try again.');
    }
  }

  // DELETE: Delete brand
  async deleteBrand(brandId) {
    try {
      const response = await fetch(`${BASE_URL}/brands/${brandId}`, {
        method: 'DELETE',
        ...API_CONFIG
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Some APIs return 204 No Content for successful deletes
      if (response.status === 204) {
        return { success: true };
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw new Error('Failed to delete brand. Please try again.');
    }
  }
}

// Create singleton instance
const brandsApi = new BrandsApiService();

export default brandsApi;

// Helper function to validate brand data before API calls
export const validateBrandData = (brandData) => {
  const errors = [];
  
  if (!brandData.name || brandData.name.trim() === '') {
    errors.push('Brand name is required');
  }
  
  if (!brandData.short_name || brandData.short_name.trim() === '') {
    errors.push('Short name is required');
  }
  
  if (!brandData.sap_division_code || brandData.sap_division_code.trim() === '') {
    errors.push('SAP Division Code is required');
  }
  
  if (!brandData.article_type || brandData.article_type.trim() === '') {
    errors.push('Article Type is required');
  }
  
  if (!brandData.merchandise_code || brandData.merchandise_code.trim() === '') {
    errors.push('Merchandise Code is required');
  }
  
  return errors;
};

// Helper function to format brand data for display
export const formatBrandForDisplay = (brand) => {
  return {
    id: brand.brand_id || brand.id,
    brand_id: brand.brand_id,
    name: brand.name || '',
    description: brand.description || '',
    short_name: brand.short_name || '',
    sap_division_code: brand.sap_division_code || '',
    article_type: brand.article_type || '',
    merchandise_code: brand.merchandise_code || '',
    status: brand.status || 'Active',
    created_at: brand.created_at || new Date().toISOString(),
    updated_at: brand.updated_at || new Date().toISOString()
  };
};