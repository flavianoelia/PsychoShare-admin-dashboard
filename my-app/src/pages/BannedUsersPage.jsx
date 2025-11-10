import React from 'react';
import { useBans } from '../hooks/useBans';
import { useModal } from '../hooks/useModal';
import BanUserModal from '../components/admin/BanUserModal';
import BanDetailsModal from '../components/admin/BanDetailsModal';

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
    banUser
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
      const result = await unbanUser(userId);
      if (result.success) {
        alert(`User "${username}" has been unbanned successfully.`);
      } else {
        alert(result.error);
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🚫 Banned Users Management</h1>
        <button 
          className="btn btn-danger"
          onClick={handleNewBan}
          type="button"
        >
          🔒 Ban User
        </button>
      </div>

      {/* Status Filters */}
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="btn-group" role="group">
            <button 
              className={`btn ${!filters.status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={clearFilters}
              type="button"
            >
              All Bans
            </button>
            <button 
              className={`btn ${filters.status === 'active' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => handleStatusFilter('active')}
              type="button"
            >
              Active Bans
            </button>
            <button 
              className={`btn ${filters.status === 'expired' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => handleStatusFilter('expired')}
              type="button"
            >
              Expired/Lifted
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <small className="text-muted">
            Showing {bans.length} of {totalCount} banned users
          </small>
        </div>
      </div>

      {/* Ban Type Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Ban Type</label>
          <select 
            className="form-select form-select-sm"
            value={filters.banType || ''}
            onChange={(e) => handleStatusFilter('banType', 'banType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Temporary">Temporary</option>
            <option value="Permanent">Permanent</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Date From</label>
          <input 
            type="date"
            className="form-control form-control-sm"
            value={filters.dateFrom || ''}
            onChange={(e) => handleStatusFilter('dateFrom', 'dateFrom', e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Date To</label>
          <input 
            type="date"
            className="form-control form-control-sm"
            value={filters.dateTo || ''}
            onChange={(e) => handleStatusFilter('dateTo', 'dateTo', e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Actions</label>
          <div>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Reason</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Ban Date</th>
                      <th>Time Remaining</th>
                      <th>Admin</th>
                      <th>Actions</th>
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
                              {ban.banType}
                            </span>
                          </td>
                          <td>
                            {getBanStatusBadge(ban)}
                          </td>
                          <td>{new Date(ban.banDate).toLocaleDateString()}</td>
                          <td>
                            {ban.banType === 'Permanent' ? (
                              <span className="text-danger fw-bold">Never</span>
                            ) : ban.isActive ? (
                              <span className="text-warning">{calculateTimeRemaining(ban.expiryDate)}</span>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>
                            <small className="text-muted">{ban.adminUsername}</small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewBan(ban)}
                                title="View Details"
                              >
                                👁️
                              </button>
                              {ban.isActive && (
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleUnban(ban.userId, ban.username)}
                                  title="Unban User"
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
            
            <div className="card-footer">
              <nav>
                <ul className="pagination pagination-sm mb-0 justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(Math.ceil(totalCount / pageSize))].map((_, index) => {
                    const pageNum = index + 1;
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
                  })}
                  
                  <li className={`page-item ${!hasMore ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasMore}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
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