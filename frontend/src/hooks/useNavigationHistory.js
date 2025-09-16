import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Custom hook to manage navigation history and handle browser back button properly
 * This helps with error state management and navigation recovery
 */
export const useNavigationHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const historyRef = useRef([]);

  useEffect(() => {
    // Add current location to history if it's not the same as the last one
    const currentPath = location.pathname;
    const lastPath = historyRef.current[historyRef.current.length - 1];
    
    if (currentPath !== lastPath) {
      historyRef.current.push(currentPath);
      
      // Keep only last 10 paths to prevent memory issues
      if (historyRef.current.length > 10) {
        historyRef.current = historyRef.current.slice(-10);
      }
    }
  }, [location]);

  const goBack = () => {
    if (historyRef.current.length > 1) {
      // Remove current page and go to previous
      historyRef.current.pop();
      const previousPath = historyRef.current[historyRef.current.length - 1];
      navigate(previousPath);
    } else if (window.history.length > 1) {
      // Use browser's back if we have browser history
      window.history.back();
    } else {
      // Default to dashboard if no history
      navigate('/dashboard');
    }
  };

  const goHome = () => {
    historyRef.current = ['/dashboard'];
    navigate('/dashboard');
  };

  const clearHistory = () => {
    historyRef.current = [];
  };

  return {
    goBack,
    goHome,
    clearHistory,
    history: historyRef.current
  };
};