import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function AdminAuthGuard({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    // Try both claim formats
    const roleClaim = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const roleId = parseInt(roleClaim);

    // Only Admin (2) and SuperAdmin (3) can access
    if (roleId < 2) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }
}

export default AdminAuthGuard;