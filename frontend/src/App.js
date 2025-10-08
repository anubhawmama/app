import React, { createContext, useContext, useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login"; 
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import Planning from "./components/Planning";
import EnhancedPlanning from "./components/EnhancedPlanning";
import FinancialPlanning from "./components/FinancialPlanning";
import Analytics from "./components/Analytics";
import SystemManagement from "./components/SystemManagement";
import PlanningRequests from "./components/PlanningRequests";
import PlanManagement from "./components/PlanManagement";
import Reports from "./components/Reports";
import Permission from "./components/Permission";
import Departments from "./components/Departments";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Users from "./components/Users";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Clear corrupted auth data
        localStorage.removeItem('adminUser');
        console.warn('Corrupted auth data cleared');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call backend logout to cleanup session
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of backend call result
      setUser(null);
      localStorage.removeItem('adminUser');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/planning" element={
                <ProtectedRoute>
                  <FinancialPlanning />
                </ProtectedRoute>
              } />
              <Route path="/planning-enhanced" element={
                <ProtectedRoute>
                  <EnhancedPlanning />
                </ProtectedRoute>
              } />
              <Route path="/planning-legacy" element={
                <ProtectedRoute>
                  <Planning />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/system-management" element={
                <ProtectedRoute>
                  <SystemManagement />
                </ProtectedRoute>
              } />
              <Route path="/planning-requests" element={
                <ProtectedRoute>
                  <PlanningRequests />
                </ProtectedRoute>
              } />
              <Route path="/plan-management" element={
                <ProtectedRoute>
                  <PlanManagement />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/permission" element={
                <ProtectedRoute>
                  <Permission />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/system-management/departments" element={
                <ProtectedRoute>
                  <Departments />
                </ProtectedRoute>
              } />
              <Route path="/system-management/brands" element={
                <ProtectedRoute>
                  <Brands />
                </ProtectedRoute>
              } />
              <Route path="/system-management/categories" element={
                <ProtectedRoute>
                  <Brands />
                </ProtectedRoute>
              } />
              <Route path="/system-management/subcategories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/system-management/products" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              <Route path="/system-management/users" element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;