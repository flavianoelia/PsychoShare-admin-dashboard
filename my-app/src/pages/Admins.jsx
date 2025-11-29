import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { rolesService } from '../services/admin/rolesService';

function Admins() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [changedRoles, setChangedRoles] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    // Check if current user is SuperAdmin
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('🔍 DEBUG Token decoded:', decoded);
        
        // Try to get role from claims
        let roleClaim = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        // WORKAROUND: Backend no incluye rol en JWT, usar email como fallback
        if (!roleClaim) {
          console.warn('⚠️ Backend no incluye rol en JWT. Usando email como workaround.');
          if (decoded.email === 'superadmin@psychoshare.com') {
            roleClaim = '3'; // SuperAdmin
            console.log('✅ Usuario identificado como SuperAdmin por email');
          } else if (decoded.email && decoded.email.includes('admin')) {
            roleClaim = '2'; // Admin
          } else {
            roleClaim = '1'; // User regular
          }
        }
        
        console.log('🔍 DEBUG Role claim:', roleClaim, 'Type:', typeof roleClaim);
        const roleAsNumber = parseInt(roleClaim);
        console.log('🔍 DEBUG Role as number:', roleAsNumber);
        setCurrentUserRole(roleAsNumber);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString()
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5174';
      const response = await fetch(`${API_BASE_URL}/api/User/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      // Backend devuelve: { users, totalCount, hasMore }
      setUsers(data.users || []);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasMore || false);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (userId, newRoleId) => {
    setChangedRoles(prev => ({
      ...prev,
      [userId]: parseInt(newRoleId)
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const updates = Object.entries(changedRoles);
    
    try {
      for (const [userId, roleId] of updates) {
        const result = await rolesService.assignRole(userId, roleId);
        if (!result.success) {
          alert(`Error al asignar rol a usuario ${userId}: ${result.error}`);
          setSaving(false);
          return;
        }
      }
      
      alert('Roles actualizados correctamente');
      setChangedRoles({});
      fetchUsers();
    } catch (err) {
      alert('Error al guardar cambios');
      console.error('Error saving roles:', err);
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeClass = (roleName) => {
    switch (roleName) {
      case 'User':
      case 'Usuario':
        return 'bg-secondary';
      case 'Admin':
      case 'Administración':
        return 'bg-primary';
      case 'SuperAdmin':
      case 'Superadmin':
      case 'Superadministrador':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getRoleIdFromName = (roleName) => {
    // Mapeo exacto del backend: User=1, Admin=2, Superadmin=3
    const roleMap = {
      'User': 1,
      'Admin': 2,
      'Superadmin': 3
    };
    return roleMap[roleName] || 1;
  };

  const getRoleNameFromId = (roleId) => {
    const roleNames = {
      1: 'Usuario',
      2: 'Administración',
      3: 'Superadministrador'
    };
    return roleNames[roleId] || 'Usuario';
  };

  const getEffectiveRole = (user) => {
    if (changedRoles[user.id]) {
      // Si hay cambio pendiente, mostrar en español
      return getRoleNameFromId(changedRoles[user.id]);
    }
    // Convertir el rol del backend a español para display consistente
    return getRoleNameFromId(getRoleIdFromName(user.roleName));
  };

  // Only SuperAdmin (role 3) can access this page
  if (currentUserRole !== null && currentUserRole !== 3) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Acceso Denegado</h4>
          <p>Solo los SuperAdministradores pueden gestionar roles de usuarios.</p>
        </div>
      </div>
    );
  }

  if (loading && users.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Roles</h1>
        {Object.keys(changedRoles).length > 0 && (
          <button 
            className="btn btn-success"
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? 'Guardando...' : `Guardar Cambios (${Object.keys(changedRoles).length})`}
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todos los roles</option>
            <option value="User">Usuario</option>
            <option value="Admin">Administración</option>
            <option value="Superadmin">Superadministrador</option>
          </select>
        </div>
        <div className="col-md-3 text-end">
          <small className="text-muted">
            {totalCount} usuarios totales
          </small>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="card">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol Actual</th>
                <th>Cambiar Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <em>No se encontraron usuarios</em>
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const effectiveRole = getEffectiveRole(user);
                  const userId = user.id;
                  
                  return (
                    <tr key={userId}>
                      <td>#{userId}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="avatar-sm bg-info text-white rounded-circle me-2 d-flex align-items-center justify-content-center" 
                            style={{width: '32px', height: '32px'}}
                          >
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span>{user.name} {user.lastName}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(effectiveRole)}`}>
                          {effectiveRole || 'Usuario'}
                          {changedRoles[userId] ? ' (modificado)' : ''}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={changedRoles[userId] || getRoleIdFromName(user.roleName)}
                          onChange={(e) => handleRoleChange(userId, e.target.value)}
                        >
                          <option value="1">Usuario</option>
                          <option value="2">Administración</option>
                          {currentUserRole === 3 && (
                            <option value="3">Superadministrador</option>
                          )}
                        </select>
                        {currentUserRole !== 3 && (
                          <small className="text-muted d-block mt-1">
                            No se puede asignar SuperAdmin
                          </small>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="card-footer">
          <nav>
            <ul className="pagination pagination-sm mb-0 justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              </li>
              
              {[...Array(Math.ceil(totalCount / pageSize))].map((_, index) => {
                const pageNum = index + 1;
                // Show only nearby pages
                if (pageNum === 1 || pageNum === Math.ceil(totalCount / pageSize) || 
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return <li key={pageNum} className="page-item disabled"><span className="page-link">...</span></li>;
                }
                return null;
              })}
              
              <li className={`page-item ${!hasMore ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!hasMore}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Admins;