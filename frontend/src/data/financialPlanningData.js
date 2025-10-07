// Sample data based on Django schema for financial planning

// Departments
export const departments = [
  { id: 1, name: 'Marketing', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Sales', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Finance', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Operations', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

// Roles
export const roles = [
  { id: 1, name: 'Admin', description: 'Administrator with full access', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Manager', description: 'Department manager', created_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Analyst', description: 'Data analyst', created_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Finance User', description: 'Finance department user', created_at: '2024-01-01T00:00:00Z' }
];

// Financial Users
export const financialUsers = [
  {
    id: 1,
    email: 'marketing.admin@company.com',
    first_name: 'John',
    last_name: 'Smith',
    department: 1, // Marketing
    role: 1, // Admin
    is_staff: true,
    is_active: true,
    date_joined: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    email: 'sales.manager@company.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    department: 2, // Sales
    role: 2, // Manager
    is_staff: false,
    is_active: true,
    date_joined: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    email: 'finance.user@company.com',
    first_name: 'Mike',
    last_name: 'Chen',
    department: 3, // Finance
    role: 4, // Finance User
    is_staff: false,
    is_active: true,
    date_joined: '2024-01-01T00:00:00Z'
  }
];

// Brands
export const brands = [
  { id: 1, name: 'Brand Alpha', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Brand Beta', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Brand Gamma', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'Brand Delta', is_active: true, created_at: '2024-01-01T00:00:00Z' }
];

// Plan Types
export const planTypes = [
  { id: 1, name: 'Monthly', description: 'Monthly planning cycle' },
  { id: 2, name: 'Yearly', description: 'Annual planning cycle' }
];

// Plan Status
export const planStatus = [
  { id: 1, name: 'Draft', description: 'Plan is in draft state', is_default: true },
  { id: 2, name: 'Submitted', description: 'Plan has been submitted for approval', is_default: false },
  { id: 3, name: 'Approved', description: 'Plan has been approved', is_default: false },
  { id: 4, name: 'Rejected', description: 'Plan has been rejected', is_default: false }
];

// Input Matrix - Hierarchical structure up to 4 levels
export const inputMatrices = [
  // Level 1: Main categories
  {
    id: 1,
    name: 'GMV',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: null,
    brands: [1, 2], // Brand Alpha, Brand Beta
    is_reclass: false,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Discount',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: null,
    brands: [1, 2], // Brand Alpha, Brand Beta
    is_reclass: false,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Spend Break Ups',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: null,
    brands: [],
    is_reclass: false,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'GST',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: null,
    brands: [],
    is_reclass: false,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Level 2: Sub-categories under Spend Break Ups
  {
    id: 5,
    name: 'Consumer Promo (All Channels)- Reclass',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: 3, // Spend Break Ups
    brands: [1, 2], // Brand Alpha, Brand Beta
    is_reclass: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Samples (All Channel)',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: 3, // Spend Break Ups
    brands: [],
    is_reclass: false,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 7,
    name: 'Off Invoice (Ecom)- Reclass',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: 3, // Spend Break Ups
    brands: [],
    is_reclass: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 8,
    name: 'Success Fee (Ecom)- Reclass',
    department: 1, // Marketing
    data_type: 'VALUE',
    parent: 3, // Spend Break Ups
    brands: [],
    is_reclass: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Plans
export const plans = [
  {
    id: 1,
    name: 'Q1 2025 Marketing Plan',
    unique_code: 'MKT-Q1-2025-001',
    plan_type: 1, // Monthly
    year: 2025,
    month: null, // Quarterly plan covers multiple months
    start_date: '2025-01-01T00:00:00Z',
    end_date: '2025-03-31T23:59:59Z',
    department: 1, // Marketing
    status: 1, // Draft
    created_by: 1, // John Smith
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Q1 2025 Sales Plan',
    unique_code: 'SLS-Q1-2025-001',
    plan_type: 1, // Monthly
    year: 2025,
    month: null,
    start_date: '2025-01-01T00:00:00Z',
    end_date: '2025-03-31T23:59:59Z',
    department: 2, // Sales
    status: 2, // Submitted
    created_by: 2, // Sarah Johnson
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z'
  }
];

// Plan Data - Monthly planned values
export const planData = [
  // GMV - Brand Alpha
  { id: 1, plan: 1, input_matrix: 1, month: 1, brand: 1, planned_value: 120000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Jan
  { id: 2, plan: 1, input_matrix: 1, month: 2, brand: 1, planned_value: 130000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Feb
  { id: 3, plan: 1, input_matrix: 1, month: 3, brand: 1, planned_value: 140000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Mar

  // GMV - Brand Beta
  { id: 4, plan: 1, input_matrix: 1, month: 1, brand: 2, planned_value: 80000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Jan
  { id: 5, plan: 1, input_matrix: 1, month: 2, brand: 2, planned_value: 85000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Feb
  { id: 6, plan: 1, input_matrix: 1, month: 3, brand: 2, planned_value: 90000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Mar

  // Discount - Brand Alpha
  { id: 7, plan: 1, input_matrix: 2, month: 1, brand: 1, planned_value: 5000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Jan
  { id: 8, plan: 1, input_matrix: 2, month: 2, brand: 1, planned_value: 5200.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Feb
  { id: 9, plan: 1, input_matrix: 2, month: 3, brand: 1, planned_value: 5500.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }, // Mar

  // Discount - Brand Beta (all zeros as shown in screenshot)
  { id: 10, plan: 1, input_matrix: 2, month: 1, brand: 2, planned_value: 0.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 11, plan: 1, input_matrix: 2, month: 2, brand: 2, planned_value: 0.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 12, plan: 1, input_matrix: 2, month: 3, brand: 2, planned_value: 0.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },

  // Consumer Promo - Brand Alpha
  { id: 13, plan: 1, input_matrix: 5, month: 1, brand: 1, planned_value: 10000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 14, plan: 1, input_matrix: 5, month: 2, brand: 1, planned_value: 11000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 15, plan: 1, input_matrix: 5, month: 3, brand: 1, planned_value: 12000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },

  // Consumer Promo - Brand Beta
  { id: 16, plan: 1, input_matrix: 5, month: 1, brand: 2, planned_value: 7000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 17, plan: 1, input_matrix: 5, month: 2, brand: 2, planned_value: 7500.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 18, plan: 1, input_matrix: 5, month: 3, brand: 2, planned_value: 8000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },

  // Samples (All Channel) - No brand breakdown
  { id: 19, plan: 1, input_matrix: 6, month: 1, brand: null, planned_value: 1500.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 20, plan: 1, input_matrix: 6, month: 2, brand: null, planned_value: 1500.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 21, plan: 1, input_matrix: 6, month: 3, brand: null, planned_value: 1600.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },

  // GST
  { id: 22, plan: 1, input_matrix: 4, month: 1, brand: null, planned_value: 18000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 23, plan: 1, input_matrix: 4, month: 2, brand: null, planned_value: 19000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' },
  { id: 24, plan: 1, input_matrix: 4, month: 3, brand: null, planned_value: 20000.00, created_by: 1, created_at: '2024-12-01T00:00:00Z' }
];

// Actual Data - Finance department entries
export const actualData = [
  // GMV Actuals - Brand Alpha (Q1 Actual: 257,000)
  { id: 1, department: 1, input_matrix: 1, year: 2025, month: 1, brand: 1, actual_value: 85000.00, entered_by: 3 }, // Jan
  { id: 2, department: 1, input_matrix: 1, year: 2025, month: 2, brand: 1, actual_value: 87000.00, entered_by: 3 }, // Feb
  { id: 3, department: 1, input_matrix: 1, year: 2025, month: 3, brand: 1, actual_value: 85000.00, entered_by: 3 }, // Mar

  // GMV Actuals - Brand Beta (Q1 Actual: 168,000)
  { id: 4, department: 1, input_matrix: 1, year: 2025, month: 1, brand: 2, actual_value: 55000.00, entered_by: 3 },
  { id: 5, department: 1, input_matrix: 1, year: 2025, month: 2, brand: 2, actual_value: 57000.00, entered_by: 3 },
  { id: 6, department: 1, input_matrix: 1, year: 2025, month: 3, brand: 2, actual_value: 56000.00, entered_by: 3 },

  // All other actuals are 0 (as shown in Q1 ACTUAL column)
  { id: 7, department: 1, input_matrix: 2, year: 2025, month: 1, brand: 1, actual_value: 0.00, entered_by: 3 },
  { id: 8, department: 1, input_matrix: 2, year: 2025, month: 2, brand: 1, actual_value: 0.00, entered_by: 3 },
  { id: 9, department: 1, input_matrix: 2, year: 2025, month: 3, brand: 1, actual_value: 0.00, entered_by: 3 },

  // GST Actual: 37,700
  { id: 10, department: 1, input_matrix: 4, year: 2025, month: 1, brand: null, actual_value: 12000.00, entered_by: 3 },
  { id: 11, department: 1, input_matrix: 4, year: 2025, month: 2, brand: null, actual_value: 12500.00, entered_by: 3 },
  { id: 12, department: 1, input_matrix: 4, year: 2025, month: 3, brand: null, actual_value: 13200.00, entered_by: 3 }
];

// Helper functions to build hierarchical structure
export const buildInputMatrixHierarchy = (departmentId) => {
  const matrices = inputMatrices.filter(matrix => matrix.department === departmentId && matrix.is_active);
  
  // Build hierarchy
  const rootItems = matrices.filter(matrix => !matrix.parent);
  
  const addChildren = (parent) => {
    const children = matrices.filter(matrix => matrix.parent === parent.id);
    return {
      ...parent,
      children: children.map(addChildren)
    };
  };
  
  return rootItems.map(addChildren);
};

// Helper to get plan data for a specific matrix and month
export const getPlanDataForMatrix = (planId, matrixId, month, brandId = null) => {
  return planData.find(pd => 
    pd.plan === planId && 
    pd.input_matrix === matrixId && 
    pd.month === month && 
    pd.brand === brandId
  );
};

// Helper to get actual data for a specific matrix and month
export const getActualDataForMatrix = (departmentId, matrixId, year, month, brandId = null) => {
  return actualData.find(ad => 
    ad.department === departmentId && 
    ad.input_matrix === matrixId && 
    ad.year === year && 
    ad.month === month && 
    ad.brand === brandId
  );
};

// Helper to calculate quarterly totals
export const calculateQuarterlyTotals = (planId, matrixId, brandId = null, isActual = false, departmentId = null) => {
  let total = 0;
  
  for (let month = 1; month <= 3; month++) { // Q1 = Jan, Feb, Mar
    if (isActual && departmentId) {
      const actualEntry = getActualDataForMatrix(departmentId, matrixId, 2025, month, brandId);
      if (actualEntry) total += parseFloat(actualEntry.actual_value);
    } else {
      const planEntry = getPlanDataForMatrix(planId, matrixId, month, brandId);
      if (planEntry) total += parseFloat(planEntry.planned_value);
    }
  }
  
  return total;
};