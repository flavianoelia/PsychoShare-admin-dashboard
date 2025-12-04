import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function AdminAuthGuard({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Primero intentar obtener el rol desde localStorage (backend lo guarda al login)
    const roleFromStorage = localStorage.getItem('role');
    
    if (roleFromStorage) {
      // El backend devuelve "Superadmin" o "Admin" como string
      if (roleFromStorage === 'Superadmin' || roleFromStorage === 'Admin') {
        return children;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
    
    // Fallback: decodificar del JWT si no está en localStorage
    const decoded = jwtDecode(token);
    const roleClaim = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    
    if (roleClaim === 'Superadmin' || roleClaim === 'Admin' || roleClaim === '3' || roleClaim === '2') {
      return children;
    }

    return <Navigate to="/login" replace />;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }
}

export default AdminAuthGuard;