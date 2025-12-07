import React, { useState } from 'react';

function BanDetailsModal({ ban, isOpen, onClose, onUnban }) {
  const [isUnbanning, setIsUnbanning] = useState(false);
  
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
    console.log('Unban button clicked');
    
    if (isUnbanning) {
      console.log('Already processing, ignoring...');
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to unban user "${ban.username || ban.userId}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      setIsUnbanning(true);
      console.log('Calling onUnban...');
      
      try {
        onUnban(ban.userId, ban.username || ban.userId);
        console.log('onUnban called successfully');
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
          setIsUnbanning(false);
        }, 500);
      } catch (error) {
        console.error('Error calling onUnban:', error);
        setIsUnbanning(false);
      }
    }
  };

  return (
    <div 
      key={`ban-modal-${ban.id}`}
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={(e) => {
        // Only close if clicking the overlay, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">🚫 Detalles del Ban - #{ban.id}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-bold">Informacion del usuario</h6>
                <p><strong>Username:</strong> {ban.username}</p>
                <p><strong>Email:</strong> {ban.email || 'N/A'}</p>
                <p><strong>User ID:</strong> {ban.userId}</p>
              </div>
              
              <div className="col-md-6">
                <h6 className="fw-bold">Informacion del admin</h6>
                <p><strong>Banned by:</strong> {ban.adminUsername}</p>
                <p><strong>Admin ID:</strong> {ban.adminUserId || 'N/A'}</p>
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-12">
                <h6 className="fw-bold">Detalles del ban</h6>
                <p><strong>Razón:</strong> <span className="badge bg-warning text-dark">{ban.reason}</span></p>
                <p><strong>Tipo:</strong> 
                  <span className={`badge ms-2 ${ban.banType === 'Permanente' ? 'bg-danger' : 'bg-info'}`}>
                    {ban.banType}
                  </span>
                </p>
                <p><strong> Estado:</strong> 
                  <span className={`badge ms-2 ${ban.isActive ? 'bg-success' : 'bg-secondary'}`}>
                    {ban.isActive ? 'Activo' : 'Expired/Lifted'}
                  </span>
                </p>
                <p><strong>Duracion:</strong> {ban.duration}</p>
                <p><strong>Ban fecha:</strong> {new Date(ban.banDate).toLocaleString()}</p>
                {ban.expiryDate && (
                  <p><strong>Fecha de expiro:</strong> {new Date(ban.expiryDate).toLocaleString()}</p>
                )}
                {ban.unbanDate && (
                  <p><strong>Fecha no prohibida:</strong> {new Date(ban.unbanDate).toLocaleString()}</p>
                )}
              </div>
            </div>
            
            {ban.isActive && ban.banType === 'Temporal' && ban.expiryDate && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Tiempo restante</h6>
                    <div className="alert alert-info">
                      <strong>⏰ {calculateTimeRemaining(ban.expiryDate)}</strong> hasta que expire la prohibición
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {ban.banType === 'Permanent' && ban.isActive && (
              <>
                <hr />
                <div className="alert alert-danger">
                  <strong>⚠️ Esta es una prohibición permanente.</strong> El usuario permanecerá baneado hasta que un administrador lo levante manualmente.
                </div>
              </>
            )}
            
            {ban.notes && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Notas Adiccionales</h6>
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
              Cerrar
            </button>
            
            {ban.isActive && (
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={handleUnban}
                disabled={isUnbanning}
                style={{ pointerEvents: isUnbanning ? 'none' : 'auto' }}
              >
                {isUnbanning ? '🔄 Procesando...' : '🔓 Desbloquear usuario'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BanDetailsModal;