import React from 'react';

function BanDetailsModal({ ban, isOpen, onClose, onUnban }) {
  if (!isOpen || !ban) return null;

  const calculateTimeRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours, ${minutes} minutes`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  const handleUnban = () => {
    const confirmed = window.confirm(
      `Are you sure you want to unban user "${ban.username}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      onUnban(ban.userId, ban.username);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">🚫 Ban Details - #{ban.id}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-bold">User Information</h6>
                <p><strong>Username:</strong> {ban.username}</p>
                <p><strong>Email:</strong> {ban.email || 'N/A'}</p>
                <p><strong>User ID:</strong> {ban.userId}</p>
              </div>
              
              <div className="col-md-6">
                <h6 className="fw-bold">Admin Information</h6>
                <p><strong>Banned by:</strong> {ban.adminUsername}</p>
                <p><strong>Admin ID:</strong> {ban.adminUserId || 'N/A'}</p>
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-12">
                <h6 className="fw-bold">Ban Details</h6>
                <p><strong>Reason:</strong> <span className="badge bg-warning text-dark">{ban.reason}</span></p>
                <p><strong>Type:</strong> 
                  <span className={`badge ms-2 ${ban.banType === 'Permanent' ? 'bg-danger' : 'bg-info'}`}>
                    {ban.banType}
                  </span>
                </p>
                <p><strong>Status:</strong> 
                  <span className={`badge ms-2 ${ban.isActive ? 'bg-success' : 'bg-secondary'}`}>
                    {ban.isActive ? 'Active' : 'Expired/Lifted'}
                  </span>
                </p>
                <p><strong>Duration:</strong> {ban.duration}</p>
                <p><strong>Ban Date:</strong> {new Date(ban.banDate).toLocaleString()}</p>
                {ban.expiryDate && (
                  <p><strong>Expiry Date:</strong> {new Date(ban.expiryDate).toLocaleString()}</p>
                )}
                {ban.unbanDate && (
                  <p><strong>Unbanned Date:</strong> {new Date(ban.unbanDate).toLocaleString()}</p>
                )}
              </div>
            </div>
            
            {ban.isActive && ban.banType === 'Temporary' && ban.expiryDate && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Time Remaining</h6>
                    <div className="alert alert-info">
                      <strong>⏰ {calculateTimeRemaining(ban.expiryDate)}</strong> until ban expires
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {ban.banType === 'Permanent' && ban.isActive && (
              <>
                <hr />
                <div className="alert alert-danger">
                  <strong>⚠️ This is a permanent ban.</strong> The user will remain banned until manually unbanned by an administrator.
                </div>
              </>
            )}
            
            {ban.notes && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Additional Notes</h6>
                    <div className="alert alert-light">
                      {ban.notes}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
            
            {ban.isActive && (
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={handleUnban}
              >
                🔓 Unban User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BanDetailsModal;