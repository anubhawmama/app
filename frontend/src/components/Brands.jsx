import React from 'react';
import AppLayout from './AppLayout';
import BrandsManagement from './BrandsManagement';

const Brands = () => {
  return (
    <AppLayout title="Brands Management" subtitle="Manage brand information and details">
      <BrandsManagement />
    </AppLayout>
  );
};

export default Brands;