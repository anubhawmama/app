// Enhanced hierarchical planning data structure
export const mockHierarchicalPlanningData = {
  // Department-Brand-Product assignments
  departmentAssignments: {
    1: { // Engineering Department
      brands: [1, 2], // TechCorp, InnovateX
      products: [1, 2, 5], // Products assigned to Engineering
      categories: [1, 3], // Software Development, Customer Support
      subcategories: [1, 2, 3, 6, 7] // Frontend, Backend, Mobile, Email Support, Live Chat
    },
    2: { // Marketing Department  
      brands: [1, 2, 3, 4], // All brands
      products: [1, 2, 3, 4, 5], // All products for marketing
      categories: [2], // Digital Marketing
      subcategories: [4, 5] // Social Media, Content Marketing
    },
    3: { // Sales Department
      brands: [1, 3], // TechCorp, CloudFirst
      products: [1, 3, 5], // Selected products for sales
      categories: [1, 3], // Software Development, Customer Support
      subcategories: [1, 6, 7] // Frontend, Email Support, Live Chat
    },
    4: { // Product Department
      brands: [2, 4], // InnovateX, DataPro
      products: [2, 4], // Product-specific items
      categories: [4], // Research & Development
      subcategories: [2, 3] // Backend, Mobile
    },
    5: { // Finance Department
      brands: [1, 2, 3, 4], // All brands for financial tracking
      products: [1, 2, 3, 4, 5], // All products
      categories: [1, 2, 3, 4], // All categories
      subcategories: [1, 2, 3, 4, 5, 6, 7] // All subcategories
    }
  },

  // Monthly planning data: planId-departmentId-brandId-productId
  monthlyPlanningData: {
    // Plan 2: Q2 2025 Product Launch - Monthly breakdown
    '2-1-1-1': { // Engineering-TechCorp-Laptop Pro
      jan: { planned: 150, actual: 145, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Faustino Shields' },
      feb: { planned: 160, actual: 158, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Faustino Shields' },
      mar: { planned: 170, actual: 165, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Faustino Shields' },
      apr: { planned: 180, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 190, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 200, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },
    '2-1-1-5': { // Engineering-TechCorp-Support Suite
      jan: { planned: 80, actual: 75, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Faustino Shields' },
      feb: { planned: 85, actual: 82, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Faustino Shields' },
      mar: { planned: 90, actual: 88, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Faustino Shields' },
      apr: { planned: 95, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 100, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 105, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },
    '2-1-2-2': { // Engineering-InnovateX-Mobile App
      jan: { planned: 120, actual: 115, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Faustino Shields' },
      feb: { planned: 125, actual: 130, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Faustino Shields' },
      mar: { planned: 130, actual: 128, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Faustino Shields' },
      apr: { planned: 135, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 140, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 145, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },

    // Marketing Department data
    '2-2-1-1': { // Marketing-TechCorp-Laptop Pro
      jan: { planned: 200, actual: 195, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Sarah Johnson' },
      feb: { planned: 210, actual: 215, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Sarah Johnson' },
      mar: { planned: 220, actual: 218, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Sarah Johnson' },
      apr: { planned: 230, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 240, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 250, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },
    '2-2-2-2': { // Marketing-InnovateX-Mobile App
      jan: { planned: 150, actual: 148, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Sarah Johnson' },
      feb: { planned: 155, actual: 160, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Sarah Johnson' },
      mar: { planned: 160, actual: 158, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Sarah Johnson' },
      apr: { planned: 165, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 170, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 175, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },
    '2-2-3-3': { // Marketing-CloudFirst-Analytics
      jan: { planned: 180, actual: 175, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Sarah Johnson' },
      feb: { planned: 185, actual: 190, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Sarah Johnson' },
      mar: { planned: 190, actual: 188, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Sarah Johnson' },
      apr: { planned: 195, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 200, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 205, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },

    // Sales Department data
    '2-3-1-1': { // Sales-TechCorp-Laptop Pro
      jan: { planned: 300, actual: 295, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Mike Chen' },
      feb: { planned: 310, actual: 305, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Mike Chen' },
      mar: { planned: 320, actual: 325, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Mike Chen' },
      apr: { planned: 330, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 340, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 350, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    },
    '2-3-3-3': { // Sales-CloudFirst-Analytics
      jan: { planned: 220, actual: 215, status: 'completed', lastUpdated: '2025-01-31', updatedBy: 'Mike Chen' },
      feb: { planned: 225, actual: 230, status: 'completed', lastUpdated: '2025-02-28', updatedBy: 'Mike Chen' },
      mar: { planned: 230, actual: 228, status: 'completed', lastUpdated: '2025-03-31', updatedBy: 'Mike Chen' },
      apr: { planned: 235, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      may: { planned: 240, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null },
      jun: { planned: 245, actual: 0, status: 'pending', lastUpdated: null, updatedBy: null }
    }
  },

  // Consolidated data calculations (auto-generated from monthly data)
  consolidatedData: {
    // Brand level consolidation
    brandTotals: {
      '2-1': { // Plan 2 - Engineering Department
        1: { planned: 1545, actual: 976, variance: -569, completion: 63.1 }, // TechCorp
        2: { planned: 795, actual: 373, variance: -422, completion: 46.9 }   // InnovateX
      },
      '2-2': { // Plan 2 - Marketing Department  
        1: { planned: 1380, actual: 628, variance: -752, completion: 45.5 }, // TechCorp
        2: { planned: 1020, actual: 466, variance: -554, completion: 45.7 }, // InnovateX
        3: { planned: 1155, actual: 553, variance: -602, completion: 47.9 }  // CloudFirst
      },
      '2-3': { // Plan 2 - Sales Department
        1: { planned: 1980, actual: 925, variance: -1055, completion: 46.7 }, // TechCorp
        3: { planned: 1380, actual: 673, variance: -707, completion: 48.8 }   // CloudFirst
      }
    },

    // Category level consolidation
    categoryTotals: {
      '2-1': { // Plan 2 - Engineering Department
        1: { planned: 1545, actual: 976, variance: -569, completion: 63.1 }, // Software Development
        3: { planned: 795, actual: 373, variance: -422, completion: 46.9 }   // Customer Support
      },
      '2-2': { // Plan 2 - Marketing Department
        2: { planned: 3555, actual: 1647, variance: -1908, completion: 46.3 } // Digital Marketing
      }
    },

    // Department level consolidation
    departmentTotals: {
      '2': { // Plan 2
        1: { planned: 2340, actual: 1349, variance: -991, completion: 57.6 }, // Engineering
        2: { planned: 3555, actual: 1647, variance: -1908, completion: 46.3 }, // Marketing
        3: { planned: 3360, actual: 1598, variance: -1762, completion: 47.6 }  // Sales
      }
    }
  }
};

// Planning workflow status tracking
export const mockPlanningWorkflow = {
  '2-1': { // Plan 2 - Engineering
    status: 'in-progress',
    submittedMonths: ['jan', 'feb', 'mar'],
    pendingMonths: ['apr', 'may', 'jun'],
    lastSubmission: '2025-03-31T15:30:00Z',
    submittedBy: 'Faustino Shields',
    approvedBy: null,
    approvalDate: null,
    comments: 'Q1 numbers submitted successfully. Q2 planning in progress.'
  },
  '2-2': { // Plan 2 - Marketing
    status: 'in-progress', 
    submittedMonths: ['jan', 'feb', 'mar'],
    pendingMonths: ['apr', 'may', 'jun'],
    lastSubmission: '2025-03-31T16:45:00Z',
    submittedBy: 'Sarah Johnson',
    approvedBy: null,
    approvalDate: null,
    comments: 'Marketing campaigns tracking above target in Q1.'
  },
  '2-3': { // Plan 2 - Sales
    status: 'in-progress',
    submittedMonths: ['jan', 'feb', 'mar'],
    pendingMonths: ['apr', 'may', 'jun'],
    lastSubmission: '2025-03-31T14:20:00Z',
    submittedBy: 'Mike Chen',
    approvedBy: null,
    approvalDate: null,
    comments: 'Sales exceeding targets. Strong Q1 performance.'
  }
};

// Helper functions for data consolidation
export const consolidateDataByBrand = (planId, departmentId, brandId) => {
  const brandData = mockHierarchicalPlanningData.monthlyPlanningData;
  let totals = { planned: 0, actual: 0, variance: 0 };
  
  Object.keys(brandData).forEach(key => {
    if (key.startsWith(`${planId}-${departmentId}-${brandId}-`)) {
      const productData = brandData[key];
      Object.keys(productData).forEach(month => {
        totals.planned += productData[month].planned || 0;
        totals.actual += productData[month].actual || 0;
      });
    }
  });
  
  totals.variance = totals.actual - totals.planned;
  totals.completion = totals.planned > 0 ? ((totals.actual / totals.planned) * 100) : 0;
  
  return totals;
};

export const consolidateDataByCategory = (planId, departmentId, categoryId) => {
  // Implementation for category-level consolidation
  // This would filter products by category and sum their values
  return mockHierarchicalPlanningData.consolidatedData.categoryTotals[`${planId}-${departmentId}`]?.[categoryId] || 
         { planned: 0, actual: 0, variance: 0, completion: 0 };
};

export const consolidateDataByDepartment = (planId, departmentId) => {
  return mockHierarchicalPlanningData.consolidatedData.departmentTotals[planId]?.[departmentId] || 
         { planned: 0, actual: 0, variance: 0, completion: 0 };
};