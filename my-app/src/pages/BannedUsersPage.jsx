import React from 'react';
import { useBans } from '../hooks/useBans';
import { useModal } from '../hooks/useModal';
import BanUserModal from '../components/admin/BanUserModal';
import BanDetailsModal from '../components/admin/BanDetailsModal';
import './BannedUsersPage.css';

/**
 * Banned Users management page
 * Single Responsibility: Display and manage banned users
 */
function BannedUsersPage() {
  const {
    bans,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    hasMore,
    filters,
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

  const handleUnban = async (userId, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to unban user "${username}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        const result = await unbanUser(userId);
        if (result.success) {
          alert(`User "${username}" has been unbanned successfully.`);
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
            <button 
              className={`btn ${filters.status === 'active' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => handleStatusFilter('active')}
              type="button"
            >
              ⚡ Active Bans
            </button>
            <button 
              className={`btn ${filters.status === 'expired' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => handleStatusFilter('expired')}
              type="button"
            >
              ⏰ Expired/Lifted
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

      {/* Advanced Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">🎯 Filtros Avanzados</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Tipo de Ban</label>
                  <select 
                    className="form-select"
                    value={filters.banType || ''}
                    onChange={(e) => handleStatusFilter('banType', 'banType', e.target.value)}
                  >
                    <option value="">Todos los tipos</option>
                    <option value="Temporary">Temporario</option>
                    <option value="Permanent">Permanente</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">📅 Fecha Desde</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleStatusFilter('dateFrom', 'dateFrom', e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">📅 Fecha Hasta</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleStatusFilter('dateTo', 'dateTo', e.target.value)}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                  >
                    🗑️ Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
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
                      bans.map(ban => (
                        <tr key={ban.id}>
                          <td>#{ban.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-danger text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                {ban.username?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-bold">{ban.username}</div>
                                <small className="text-muted">{ban.email}</small>
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
                                {ban.adminUsername?.charAt(0)?.toUpperCase() || 'A'}
                              </div>
                              <small>{ban.adminUsername || 'System'}</small>
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
                                  onClick={() => handleUnban(ban.userId, ban.username || ban.userId)}
                                  title="Desbanear usuario"
                                >
                                  🔓
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
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

export default BannedUsersPage;