import React from 'react';
import { Navigate } from 'react-router-dom';


function AdminAuthGuard({ children }) {

  const token = localStorage.getItem('token');
  const isAdmin = true;
  
  if (!token || !isAdmin) {

    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default AdminAuthGuard;