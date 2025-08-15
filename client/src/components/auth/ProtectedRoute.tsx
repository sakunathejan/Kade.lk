import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import ChangePassword from './ChangePassword';

interface ProtectedRouteProps {
  requireRole?: 'admin' | 'seller' | 'superadmin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireRole }) => {
  const { state } = useAppContext();
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Show loading while initializing authentication
  if (state.isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requireRole && state.user?.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // Check if user needs to change password (for admin/seller roles)
  if (state.user && ['admin', 'seller'].includes(state.user.role) && state.user.mustChangePassword) {
    if (!showChangePassword) {
      setShowChangePassword(true);
    }
    
    return (
      <ChangePassword 
        onSuccess={() => {
          setShowChangePassword(false);
          // Refresh the page to update the user state
          window.location.reload();
        }} 
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;


