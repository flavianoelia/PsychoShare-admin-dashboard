import React, { useState } from 'react';
import './ReportDetailsModal.css';
import BanUserModal from './BanUserModal';
import { bansService } from '../../services/admin/bansService';

function ReportDetailsModal({ report, isOpen, onClose, onApprove, onReject }) {
  const [actionReason, setActionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  if (!isOpen || !report) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(report.id, actionReason);
      setActionReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(report.id, actionReason);
      setActionReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBan = async (banData) => {
    try {
      console.log('🚫 Intentando banear usuario:', banData);
      const result = await bansService.banUser(banData);
      console.log('✅ Usuario baneado exitosamente:', result);
      
      // Cerrar ambos modales
      setShowBanModal(false);
      
      // Opcionalmente, aprobar el reporte automáticamente
      if (report.status === 'Pendiente') {
        await onApprove(report.id, `Usuario baneado: ${banData.reason}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error al banear usuario:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="modal fade show d-block report-modal-overlay">
      <div className="modal-dialog modal-lg report-modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del reporte - #{report.id}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-12">
                <h6 className="fw-bold">Detalles del reporte</h6>
                <p><strong>Razón:</strong> <span className="badge bg-warning">{report.reason}</span></p>
                <p><strong>Estado:</strong> 
                  <span className={`badge ms-2 ${
                    report.status === 'Pendiente' ? 'bg-warning' : 
                    report.status === 'Resuelta' ? 'bg-success' : 'bg-secondary'
                  }`}>
                    {report.status}
                  </span>
                </p>
                <p><strong>Creado:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                {report.resolvedAt && (
                  <p><strong>Resuelto:</strong> {new Date(report.resolvedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
            
            {report.description && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Descripcion</h6>
                    <p className="report-description-box">{report.description}</p>
                  </div>
                </div>
              </>
            )}
            
            {report.adminNotes && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Admin Notas</h6>
                    <p className="report-admin-notes">{report.adminNotes}</p>
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
            
            {report.status === 'Pending' && (
              <>
                <button 
                  type="button" 
                  className="btn btn-warning" 
                  onClick={() => {
                    console.log('📋 Report completo:', report);
                    console.log('📧 reportedEmail:', report.reportedEmail);
                    console.log('👤 reportedUsername:', report.reportedUsername);
                    console.log('🆔 reportedUserId:', report.reportedUserId);
                    setShowBanModal(true);
                  }}
                  disabled={isProcessing}
                  title="Banear al usuario reportado directamente"
                >
                  <i className="bi bi-ban me-1"></i>
                  Banear Usuario
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Baneo */}
      <BanUserModal 
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        userToBan={{
          username: report.reportedUsername ?? "",
          userId: report.reportedUserId ?? "",
          email: report.reportedEmail ?? "",
          reason: report.reason ?? ""
        }}
        reportId={report.id}
        onBan={handleBan}
      />

    </div>
  );
}

export default ReportDetailsModal;