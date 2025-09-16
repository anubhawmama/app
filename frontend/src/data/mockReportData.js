// Mock report data for different report types and time periods
export const mockReportData = {
  // Brand reports
  brandReports: {
    monthly: {
      '2025-01': [
        { brand: 'TechCorp', planned: 1500, actual: 1420, variance: -80, products: 15, revenue: 2840000 },
        { brand: 'InnovateX', planned: 800, actual: 850, variance: 50, products: 8, revenue: 1700000 },
        { brand: 'CloudFirst', planned: 1200, actual: 1180, variance: -20, products: 12, revenue: 2360000 },
        { brand: 'DataPro', planned: 600, actual: 640, variance: 40, products: 6, revenue: 1280000 }
      ],
      '2025-02': [
        { brand: 'TechCorp', planned: 1600, actual: 1580, variance: -20, products: 15, revenue: 3160000 },
        { brand: 'InnovateX', planned: 850, actual: 900, variance: 50, products: 8, revenue: 1800000 },
        { brand: 'CloudFirst', planned: 1250, actual: 1300, variance: 50, products: 12, revenue: 2600000 },
        { brand: 'DataPro', planned: 650, actual: 620, variance: -30, products: 6, revenue: 1240000 }
      ],
      '2025-03': [
        { brand: 'TechCorp', planned: 1700, actual: 1750, variance: 50, products: 15, revenue: 3500000 },
        { brand: 'InnovateX', planned: 900, actual: 920, variance: 20, products: 8, revenue: 1840000 },
        { brand: 'CloudFirst', planned: 1300, actual: 1280, variance: -20, products: 12, revenue: 2560000 },
        { brand: 'DataPro', planned: 700, actual: 720, variance: 20, products: 6, revenue: 1440000 }
      ]
    },
    quarterly: {
      'Q1-2025': [
        { brand: 'TechCorp', planned: 4800, actual: 4750, variance: -50, products: 15, revenue: 9500000 },
        { brand: 'InnovateX', planned: 2550, actual: 2670, variance: 120, products: 8, revenue: 5340000 },
        { brand: 'CloudFirst', planned: 3750, actual: 3760, variance: 10, products: 12, revenue: 7520000 },
        { brand: 'DataPro', planned: 1950, actual: 1980, variance: 30, products: 6, revenue: 3960000 }
      ],
      'Q4-2024': [
        { brand: 'TechCorp', planned: 4500, actual: 4320, variance: -180, products: 15, revenue: 8640000 },
        { brand: 'InnovateX', planned: 2400, actual: 2510, variance: 110, products: 8, revenue: 5020000 },
        { brand: 'CloudFirst', planned: 3600, actual: 3550, variance: -50, products: 12, revenue: 7100000 },
        { brand: 'DataPro', planned: 1800, actual: 1850, variance: 50, products: 6, revenue: 3700000 }
      ]
    },
    yearly: {
      '2024': [
        { brand: 'TechCorp', planned: 18000, actual: 17280, variance: -720, products: 15, revenue: 34560000 },
        { brand: 'InnovateX', planned: 9600, actual: 10040, variance: 440, products: 8, revenue: 20080000 },
        { brand: 'CloudFirst', planned: 14400, actual: 14200, variance: -200, products: 12, revenue: 28400000 },
        { brand: 'DataPro', planned: 7200, actual: 7400, variance: 200, products: 6, revenue: 14800000 }
      ],
      '2023': [
        { brand: 'TechCorp', planned: 16500, actual: 15840, variance: -660, products: 15, revenue: 31680000 },
        { brand: 'InnovateX', planned: 8800, actual: 9200, variance: 400, products: 8, revenue: 18400000 },
        { brand: 'CloudFirst', planned: 13200, actual: 13050, variance: -150, products: 12, revenue: 26100000 },
        { brand: 'DataPro', planned: 6600, actual: 6800, variance: 200, products: 6, revenue: 13600000 }
      ]
    }
  },

  // Category reports
  categoryReports: {
    monthly: {
      '2025-01': [
        { category: 'Software Development', planned: 2100, actual: 2050, variance: -50, projects: 25, budget: 4100000 },
        { category: 'Digital Marketing', planned: 1200, actual: 1280, variance: 80, campaigns: 15, budget: 2560000 },
        { category: 'Customer Support', planned: 800, actual: 820, variance: 20, tickets: 1200, budget: 1640000 },
        { category: 'Research & Development', planned: 600, actual: 580, variance: -20, innovations: 8, budget: 1160000 }
      ]
    },
    quarterly: {
      'Q1-2025': [
        { category: 'Software Development', planned: 6300, actual: 6150, variance: -150, projects: 25, budget: 12300000 },
        { category: 'Digital Marketing', planned: 3600, actual: 3840, variance: 240, campaigns: 15, budget: 7680000 },
        { category: 'Customer Support', planned: 2400, actual: 2460, variance: 60, tickets: 3600, budget: 4920000 },
        { category: 'Research & Development', planned: 1800, actual: 1740, variance: -60, innovations: 24, budget: 3480000 }
      ]
    },
    yearly: {
      '2024': [
        { category: 'Software Development', planned: 25200, actual: 24600, variance: -600, projects: 100, budget: 49200000 },
        { category: 'Digital Marketing', planned: 14400, actual: 15360, variance: 960, campaigns: 60, budget: 30720000 },
        { category: 'Customer Support', planned: 9600, actual: 9840, variance: 240, tickets: 14400, budget: 19680000 },
        { category: 'Research & Development', planned: 7200, actual: 6960, variance: -240, innovations: 96, budget: 13920000 }
      ]
    }
  },

  // Department reports
  departmentReports: {
    monthly: {
      '2025-01': [
        { department: 'Engineering', planned: 1800, actual: 1750, variance: -50, employees: 45, productivity: 97.2 },
        { department: 'Marketing', planned: 1000, actual: 1050, variance: 50, employees: 25, productivity: 105.0 },
        { department: 'Sales', planned: 1200, actual: 1180, variance: -20, employees: 30, productivity: 98.3 },
        { department: 'Product', planned: 800, actual: 820, variance: 20, employees: 20, productivity: 102.5 },
        { department: 'Finance', planned: 600, actual: 590, variance: -10, employees: 15, productivity: 98.3 }
      ]
    },
    quarterly: {
      'Q1-2025': [
        { department: 'Engineering', planned: 5400, actual: 5250, variance: -150, employees: 45, productivity: 97.2 },
        { department: 'Marketing', planned: 3000, actual: 3150, variance: 150, employees: 25, productivity: 105.0 },
        { department: 'Sales', planned: 3600, actual: 3540, variance: -60, employees: 30, productivity: 98.3 },
        { department: 'Product', planned: 2400, actual: 2460, variance: 60, employees: 20, productivity: 102.5 },
        { department: 'Finance', planned: 1800, actual: 1770, variance: -30, employees: 15, productivity: 98.3 }
      ]
    },
    yearly: {
      '2024': [
        { department: 'Engineering', planned: 21600, actual: 21000, variance: -600, employees: 45, productivity: 97.2 },
        { department: 'Marketing', planned: 12000, actual: 12600, variance: 600, employees: 25, productivity: 105.0 },
        { department: 'Sales', planned: 14400, actual: 14160, variance: -240, employees: 30, productivity: 98.3 },
        { department: 'Product', planned: 9600, actual: 9840, variance: 240, employees: 20, productivity: 102.5 },
        { department: 'Finance', planned: 7200, actual: 7080, variance: -120, employees: 15, productivity: 98.3 }
      ]
    }
  },

  // Subcategory reports
  subcategoryReports: {
    monthly: {
      '2025-01': [
        { subcategory: 'Frontend Development', planned: 900, actual: 880, variance: -20, tasks: 120, efficiency: 97.8 },
        { subcategory: 'Backend Development', planned: 800, actual: 790, variance: -10, tasks: 100, efficiency: 98.8 },
        { subcategory: 'Mobile Development', planned: 400, actual: 380, variance: -20, tasks: 60, efficiency: 95.0 },
        { subcategory: 'Social Media Marketing', planned: 600, actual: 640, variance: 40, posts: 180, efficiency: 106.7 },
        { subcategory: 'Content Marketing', planned: 600, actual: 640, variance: 40, articles: 45, efficiency: 106.7 }
      ]
    },
    quarterly: {
      'Q1-2025': [
        { subcategory: 'Frontend Development', planned: 2700, actual: 2640, variance: -60, tasks: 360, efficiency: 97.8 },
        { subcategory: 'Backend Development', planned: 2400, actual: 2370, variance: -30, tasks: 300, efficiency: 98.8 },
        { subcategory: 'Mobile Development', planned: 1200, actual: 1140, variance: -60, tasks: 180, efficiency: 95.0 },
        { subcategory: 'Social Media Marketing', planned: 1800, actual: 1920, variance: 120, posts: 540, efficiency: 106.7 },
        { subcategory: 'Content Marketing', planned: 1800, actual: 1920, variance: 120, articles: 135, efficiency: 106.7 }
      ]
    },
    yearly: {
      '2024': [
        { subcategory: 'Frontend Development', planned: 10800, actual: 10560, variance: -240, tasks: 1440, efficiency: 97.8 },
        { subcategory: 'Backend Development', planned: 9600, actual: 9480, variance: -120, tasks: 1200, efficiency: 98.8 },
        { subcategory: 'Mobile Development', planned: 4800, actual: 4560, variance: -240, tasks: 720, efficiency: 95.0 },
        { subcategory: 'Social Media Marketing', planned: 7200, actual: 7680, variance: 480, posts: 2160, efficiency: 106.7 },
        { subcategory: 'Content Marketing', planned: 7200, actual: 7680, variance: 480, articles: 540, efficiency: 106.7 }
      ]
    }
  }
};

// Summary metrics for dashboard cards
export const mockReportSummary = {
  totalPlanned: 156000,
  totalActual: 158400,
  totalVariance: 2400,
  completionRate: 101.5,
  topPerformingBrand: 'InnovateX',
  topPerformingDepartment: 'Marketing',
  trendsData: [
    { month: 'Jan', planned: 5400, actual: 5290 },
    { month: 'Feb', planned: 5700, actual: 5900 },
    { month: 'Mar', actual: 6100, planned: 6000 },
    { month: 'Apr', planned: 6200, actual: 6150 },
    { month: 'May', planned: 6400, actual: 6500 },
    { month: 'Jun', planned: 6600, actual: 6800 }
  ]
};

// Report templates configuration
export const reportTemplates = {
  brand: {
    name: 'Brand Performance Report',
    description: 'Comprehensive analysis of brand performance metrics',
    columns: ['brand', 'planned', 'actual', 'variance', 'products', 'revenue'],
    charts: ['bar', 'line', 'pie']
  },
  category: {
    name: 'Category Analysis Report',
    description: 'Category-wise performance breakdown and insights',
    columns: ['category', 'planned', 'actual', 'variance', 'projects', 'budget'],
    charts: ['bar', 'donut', 'area']
  },
  department: {
    name: 'Department Performance Report', 
    description: 'Department productivity and performance metrics',
    columns: ['department', 'planned', 'actual', 'variance', 'employees', 'productivity'],
    charts: ['bar', 'line', 'radar']
  },
  subcategory: {
    name: 'Subcategory Details Report',
    description: 'Detailed subcategory performance analysis',
    columns: ['subcategory', 'planned', 'actual', 'variance', 'tasks', 'efficiency'],
    charts: ['bar', 'line', 'scatter']
  }
};