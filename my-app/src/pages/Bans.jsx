import React from 'react';
import { useBans } from '../hooks/useBans';
import { useModal } from '../hooks/useModal';
import BanUserModal from '../components/admin/BanUserModal';
import BanDetailsModal from '../components/admin/BanDetailsModal';
import './Bans.css';

/**
 * Banned Users management page
 * Single Responsibility: Display and manage banned users
 */
function Bans() {
  const {
    bans,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    hasMore,
    filters,
    usersData,
    handlePageChange,
    handleStatusFilter,
    clearFilters,
    unbanUser,
    banUser,
    refetchBans
  } = useBans();

  const { 
    isOpen: isModalOpen, 
    selectedItem: selectedBan, 
    openModal, 
    closeModal 
  } = useModal();

  const { 
    isOpen: isBanModalOpen, 
    openModal: openBanModal, 
    closeModal: closeBanModal 
  } = useModal();

  const handleNewBan = () => {
    openBanModal();
  };

  const handleBanUser = async (banData) => {
    const result = await banUser(banData);
    if (result.success) {
      closeBanModal();
    }
    return result;
  };

  const handleViewBan = (ban) => {
    openModal(ban);
  };

// Antes:
// const handleUnban = async (userId, username) => { 

// Ahora, acepta los 3 parámetros:
const handleUnban = async (userId, username, skipConfirm = false) => {
    console.log('🟠 HANDLEUNBAN - userId recibido:', userId, 'username:', username, 'skipConfirm:', skipConfirm);
    
    // Obtener el nombre para la confirmación
    const displayName = getUserDisplayName(username); 
    
    let confirmed = true; // Asumimos confirmado si el modal ya lo hizo (skipConfirm=true)

    // Solo pide confirmación si NO viene del modal (donde ya se confirmó)
    if (!skipConfirm) { 
        confirmed = window.confirm(
            `Are you sure you want to unban user "${displayName}"? This action cannot be undone.`
        );
    }
    
    // Si no se confirmó (o si venía del modal y ya se confirmó en el modal)
    if (confirmed) {
        try {
            console.log('🟠 HANDLEUNBAN - Llamando unbanUser con userId:', userId);
            const result = await unbanUser(userId);
            if (result.success) {
                alert(`User "${displayName}" has been unbanned successfully.`);
                // Refresh the bans list
                await refetchBans();
            } else {
                alert('Failed to unban user: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('An error occurred while unbanning the user.');
        }
    }
};
  // Función helper para obtener el nombre del usuario
  const getUserDisplayName = (username, fallback = null) => {
    if (!username) return fallback || 'Usuario Desconocido';
    const user = usersData[username];
    return user ? user.fullName : fallback || `${username}`;
  };

  const calculateTimeRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const getBanStatusBadge = (ban) => {
    if (!ban.isActive) {
      return <span className="badge bg-secondary">Expired/Lifted</span>;
    }
    
    if (ban.banType === 'Permanent') {
      return <span className="badge bg-danger">Permanent</span>;
    }
    
    const timeRemaining = calculateTimeRemaining(ban.expiryDate);
    if (timeRemaining === 'Expired') {
      return <span className="badge bg-warning">Expiring</span>;
    }
    
    return <span className="badge bg-success">Active</span>;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">🚫 Banned Users Management</h1>
              <p className="text-muted">Sistema para gestionar usuarios baneados</p>
            </div>
            <button 
              className="btn btn-danger"
              onClick={handleNewBan}
              type="button"
            >
              🔒 Ban User
            </button>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="btn-group" role="group" aria-label="Filtros de estado">
            <button 
              className={`btn ${!filters.status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={clearFilters}
              type="button"
            >
              🚫 All Bans
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <small className="text-muted">
            📊 Mostrando {bans.length} de {totalCount} usuarios baneados
            {filters.status && (
              <span className="badge bg-secondary ms-2">
                Filtrado: {filters.status}
              </span>
            )}
          </small>
        </div>
      </div>

        {/* Advanced Filters (removed) */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
              </div>
              {/* Filtros eliminados */}
            </div>
          </div>
        </div>
      
      {/* Tabla de Usuarios Baneados */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">👤 Usuario</th>
                      <th scope="col">📝 Razón</th>
                      <th scope="col">🔧 Tipo</th>
                      <th scope="col">⚡ Estado</th>
                      <th scope="col">⏰ Tiempo Restante</th>
                      <th scope="col">👨‍💼 Admin</th>
                      <th scope="col">📅 Fecha</th>
                      <th scope="col" className="text-center">🔧 Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bans.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          <em>No banned users found</em>
                        </td>
                      </tr>
                    ) : (
                      bans.map(ban => {
                        console.log('🔵 Ban data:', { id: ban.id, userId: ban.bannedUserId, isActive: ban.isActive, banType: ban.banType });
                        return (
                        <tr key={ban.id}>
                          <td>#{ban.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-danger text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                {getUserDisplayName(ban.bannedUserId, ban.username).charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-bold">{getUserDisplayName(ban.bannedUserId, ban.username)}</div>
                                <small className="text-muted">{usersData[ban.bannedUserId]?.email || ban.email || `ID: ${ban.bannedUserId}`}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              {ban.reason}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${ban.banType === 'Permanent' ? 'bg-danger' : 'bg-info'}`}>
                              {ban.banType === 'Permanent' ? '∞ Permanente' : '⏰ Temporario'}
                            </span>
                          </td>
                          <td>
                            {getBanStatusBadge(ban)}
                          </td>
                          <td>
                            {ban.banType === 'Permanent' ? (
                              <span className="text-muted">N/A</span>
                            ) : (
                              <span className="text-warning fw-bold">{calculateTimeRemaining(ban.expiryDate)}</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px', fontSize: '10px'}}>
                                {getUserDisplayName(ban.bannedByAdminId, ban.adminUsername).charAt(0)?.toUpperCase() || 'A'}
                              </div>
                              <small>{getUserDisplayName(ban.bannedByAdminId, ban.adminUsername)}</small>
                            </div>
                          </td>
                          <td>
                            <div className="small">
                              <div>{new Date(ban.banDate).toLocaleDateString()}</div>
                              <div className="text-muted">
                                {new Date(ban.banDate).toLocaleTimeString()}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewBan(ban)}
                                title="Ver detalles"
                              >
                                👁️
                              </button>
                              {ban.isActive && (
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleUnban(ban.bannedUserId, getUserDisplayName(ban.bannedUserId, ban.username))}
                                  title="Desbanear usuario"
                                >
                                  🔓
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Paginación */}
            {totalCount > pageSize && (
              <div className="card-footer">
                <nav aria-label="Banned users pagination">
                  <ul className="pagination pagination-sm mb-0 justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Anterior
                      </button>
                    </li>
                    
                    {[...Array(Math.ceil(totalCount / pageSize))].map((_, index) => {
                      const pageNum = index + 1;
                      // Solo mostrar páginas cercanas para evitar demasiados botones
                      if (pageNum === 1 || pageNum === Math.ceil(totalCount / pageSize) || 
                          (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
                        return (
                          <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                        return (
                          <li key={pageNum} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${!hasMore ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasMore}
                      >
                        Siguiente →
                      </button>
                    </li>
                  </ul>
                </nav>
                
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Página {currentPage} de {Math.ceil(totalCount / pageSize)} | 
                    Total: {totalCount} usuarios baneados
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BanUserModal
        isOpen={isBanModalOpen}
        onClose={closeBanModal}
        onBan={handleBanUser}
      />
      
      <BanDetailsModal
        ban={selectedBan}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUnban={handleUnban}
      />
    </div>
  );
}

export default Bans;