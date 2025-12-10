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
  if (isUnbanning) return;

  const displayName = ban.username || `ID ${ban.bannedUserId}`;

  const confirmed = window.confirm(
    `Are you sure you want to unban user "${displayName}"? This action cannot be undone.`
  );

  if (!confirmed) return;

  setIsUnbanning(true);

  // LLAMADA CORRECTA
  onUnban(
    ban.bannedUserId,   // 1) id
    displayName,        // 2) nombre real
    true                // 3) skipConfirm → NO llamar confirmación del padre
  );

  setTimeout(() => {
    onClose();
    setIsUnbanning(false);
  }, 300);
};


  return (
    <div 
      key={`ban-modal-${ban.id}`}
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">🚫 Detalles del Ban - #{ban.id}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">

            {/* DETALLES */}
            <h6 className="fw-bold">Detalles del ban</h6>

            <p><strong>Razón:</strong> 
              <span className="badge bg-warning text-dark ms-2">{ban.reason}</span>
            </p>

            <p><strong>Tipo:</strong>
              <span className={`badge ms-2 ${ban.banType === 'Permanent' ? 'bg-danger' : 'bg-info'}`}>
                {ban.banType}
              </span>
            </p>

            <p><strong>Estado:</strong>
              <span className={`badge ms-2 ${ban.isActive ? 'bg-success' : 'bg-secondary'}`}>
                {ban.isActive ? 'Activo' : 'Expired/Lifted'}
              </span>
            </p>

            <p><strong>Duración:</strong> {ban.duration}</p>
            <p><strong>Ban fecha:</strong> {new Date(ban.banDate).toLocaleString()}</p>

            {ban.expiryDate && (
              <p><strong>Expira:</strong> {new Date(ban.expiryDate).toLocaleString()}</p>
            )}

            {ban.unbanDate && (
              <p><strong>Desbaneado el:</strong> {new Date(ban.unbanDate).toLocaleString()}</p>
            )}

            {/* Tiempo restante */}
            {ban.isActive && ban.banType !== 'Permanent' && ban.expiryDate && (
              <>
                <hr />
                <h6 className="fw-bold">Tiempo restante</h6>
                <div className="alert alert-info">
                  <strong>⏰ {calculateTimeRemaining(ban.expiryDate)}</strong>
                </div>
              </>
            )}

            {/* Advertencia permanente */}
            {ban.banType === 'Permanent' && ban.isActive && (
              <>
                <hr />
                <div className="alert alert-danger">
                  <strong>⚠️ Ban permanente:</strong> solo puede levantarse manualmente.
                </div>
              </>
            )}

            {/* Notas */}
            {ban.notes && (
              <>
                <hr />
                <h6 className="fw-bold">Notas adicionales</h6>
                <div className="alert alert-light">{ban.notes}</div>
              </>
            )}

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>

            {ban.isActive && (
              <button 
                className="btn btn-success"
                disabled={isUnbanning}
                onClick={handleUnban}
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
