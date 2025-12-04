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
      if (report.status === 'Pending') {
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
            <h5 className="modal-title">Report Details - #{report.id}</h5>
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
                <h6 className="fw-bold">Reporter Information</h6>
                <p><strong>Username:</strong> {report.reporterUsername || report.reporterEmail || 'N/A'}</p>
                <p><strong>Email:</strong> {report.reporterEmail || 'N/A'}</p>
              </div>
              
              <div className="col-md-6">
                <h6 className="fw-bold">Reported User</h6>
                <p><strong>Username:</strong> {report.reportedUsername || report.reportedEmail || 'N/A'}</p>
                <p><strong>Email:</strong> {report.reportedEmail || 'N/A'}</p>
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-12">
                <h6 className="fw-bold">Report Details</h6>
                <p><strong>Reason:</strong> <span className="badge bg-warning">{report.reason}</span></p>
                <p><strong>Status:</strong> 
                  <span className={`badge ms-2 ${
                    report.status === 'Pending' ? 'bg-warning' : 
                    report.status === 'Resolved' ? 'bg-success' : 'bg-secondary'
                  }`}>
                    {report.status}
                  </span>
                </p>
                <p><strong>Created:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                {report.resolvedAt && (
                  <p><strong>Resolved:</strong> {new Date(report.resolvedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
            
            {report.description && (
              <>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold">Description</h6>
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
                    <h6 className="fw-bold">Admin Notes</h6>
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
              Close
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
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Reject Report'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Approve & Take Action'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Baneo */}
      {showBanModal && (
        <BanUserModal 
          isOpen={showBanModal}
          onClose={() => setShowBanModal(false)}
          userToBan={{
            email: report.reportedEmail,
            username: report.reportedUsername || report.reportedEmail,
            userId: report.reportedUserId
          }}
          reportId={report.id}
          onBan={handleBan}
        />
      )}
    </div>
  );
}

export default ReportDetailsModal;