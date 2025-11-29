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
    
    // Try to get role from claims
    let roleClaim = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    // WORKAROUND: Backend no incluye rol en JWT, usar email como fallback
    if (!roleClaim) {
      console.warn('⚠️ AdminAuthGuard: Backend no incluye rol en JWT. Usando email como workaround.');
      if (decoded.email === 'superadmin@psychoshare.com') {
        roleClaim = '3'; // SuperAdmin
      } else if (decoded.email && decoded.email.includes('admin')) {
        roleClaim = '2'; // Admin
      } else {
        roleClaim = '1'; // User regular
      }
    }
    
    const roleId = parseInt(roleClaim);

    // Only Admin (2) and SuperAdmin (3) can access
    if (roleId < 2 || isNaN(roleId)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }
}

export default AdminAuthGuard;