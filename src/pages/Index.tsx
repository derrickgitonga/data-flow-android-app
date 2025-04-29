
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import DashboardScreen from '@/components/DashboardScreen';
import AddExpenseScreen from '@/components/AddExpenseScreen';
import TransactionsScreen from '@/components/TransactionsScreen';
import HelpScreen from '@/components/HelpScreen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { initDB } from '@/db/database';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Main App component
const Index = () => {
  useEffect(() => {
    // Initialize database on app start
    const init = async () => {
      try {
        await initDB();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    init();
  }, []);

  return (
    <div className="min-h-screen max-w-md mx-auto overflow-hidden bg-muted/30">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-expense" 
            element={
              <ProtectedRoute>
                <AddExpenseScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <TransactionsScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <HelpScreen />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default Index;
