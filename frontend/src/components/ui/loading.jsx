import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './card';

// Main loading spinner component
export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]} ${className}`} />
  );
};

// Loading overlay for tables/grids
export const TableLoader = ({ message = "Loading data..." }) => {
  return (
    <div className="flex items-center justify-center h-64 bg-white">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-gray-500 text-sm mt-1">Please wait...</p>
      </div>
    </div>
  );
};

// Page loading component
export const PageLoader = ({ message = "Loading page..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="xl" className="mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
            <p className="text-gray-600">Please wait while we load your content...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Inline loading for buttons
export const ButtonLoader = ({ size = "sm", className = "" }) => {
  return <LoadingSpinner size={size} className={`mr-2 ${className}`} />;
};

// Grid row skeleton loader
export const SkeletonRow = ({ columns = 5 }) => {
  return (
    <tr className="border-b animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <div className="bg-gray-200 rounded h-4 w-full"></div>
        </td>
      ))}
    </tr>
  );
};

// Grid skeleton loader
export const GridSkeleton = ({ rows = 5, columns = 5, headers = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-50 border-b">
            {headers.length > 0 ? 
              headers.map((header, index) => (
                <th key={index} className="text-left p-4 font-medium text-gray-700">
                  {header}
                </th>
              )) :
              Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="text-left p-4 font-medium text-gray-700">
                  <div className="bg-gray-200 rounded h-4 w-24 animate-pulse"></div>
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <SkeletonRow key={rowIndex} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Card loading skeleton
export const CardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="space-y-2 flex-1">
            <div className="bg-gray-200 rounded h-4 w-3/4"></div>
            <div className="bg-gray-200 rounded h-3 w-1/2"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Chart loading skeleton
export const ChartSkeleton = ({ height = "300px" }) => {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-gray-200 rounded h-6 w-48"></div>
          <div className="bg-gray-100 rounded" style={{ height }}>
            <div className="flex items-end justify-around h-full p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-gray-200 rounded-t w-8" 
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Form loading overlay
export const FormLoader = ({ message = "Saving..." }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-3" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Refresh button with loading state
export const RefreshButton = ({ loading = false, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Refreshing...' : 'Refresh'}
    </button>
  );
};