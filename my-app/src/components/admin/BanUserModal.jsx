import React, { useState, useEffect } from 'react';

function BanUserModal({ isOpen, onClose, onBan, userToBan }) {
  const [formData, setFormData] = useState({
    username: '',
    userId: '',
    email: '',
    reason: '',
    banType: 'Temporal',
    duration: '7',
    durationUnit: 'dias',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-llenar formulario si viene userToBan desde un reporte
useEffect(() => {
  if (!userToBan) return;

  console.log("🟡 Datos recibidos en BanUserModal:", userToBan);

  setFormData(prev => ({
    ...prev,
    username: userToBan.username || "",
    userId: userToBan.userId || "",
    email: userToBan.email || "",
    reason: userToBan.reason || ""
  }));
}, [userToBan, isOpen]);


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username es requerido';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Razon del baneo es requerida';
    }
    
    if (formData.banType === 'Temporal') {
      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration = 'La duración debe ser mayor que 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateExpiryDate = () => {
    if (formData.banType === 'Permanente') return null;
    
    const now = new Date();
    const duration = parseInt(formData.duration);
    
    switch (formData.durationUnit) {
      case 'horas':
        return new Date(now.getTime() + duration * 60 * 60 * 1000);
      case 'dias':
        return new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
      case 'semanas':
        return new Date(now.getTime() + duration * 7 * 24 * 60 * 60 * 1000);
      case 'meses':
        return new Date(now.getTime() + duration * 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      const banData = {
        username: formData.username.trim(),
        userId: formData.userId || formData.username.trim(),
        email: formData.email || formData.username.trim(),
        reason: formData.reason.trim(),
        banType: formData.banType,
        duration: formData.banType === 'Permanente' ? null : `${formData.duration} ${formData.durationUnit}`,
        expiryDate: calculateExpiryDate(),
        notes: formData.notes.trim(),
        banDate: new Date().toISOString()
      };
      
      const result = await onBan(banData);
      
      if (result.success) {
        // Reset form
        setFormData({
          username: '',
          userId: '',
          email: '',
          reason: '',
          banType: 'Temporal',
          duration: '7',
          durationUnit: 'dias',
          notes: ''
        });
        setErrors({});
        onClose();
        alert('Usuario baneado con exito!');
      } else {
        alert(result.error || 'Error al banear usuario.');
      }
    } catch (error) {
      console.error('Error al enviar la prohibición:', error);
      alert('Error al banear usuario. Intente de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setFormData({
        username: '',
        userId: '',
        email: '',
        reason: '',
        banType: 'Temporal',
        duration: '7',
        durationUnit: 'dias',
        notes: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">🚫 Ban User</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleClose}
              disabled={isProcessing}
              aria-label="Cerrar"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-warning">
                <strong>⚠️ Cuidado:</strong> Bloquear a un usuario le impedirá acceder a la plataforma.
                Asegúrese de revisar el caso a fondo.
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Username *</label>
                    <input 
                      type="text"
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username to ban"
                      disabled={isProcessing}
                    />
                    {errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">User ID (opcional)</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      placeholder="Enter user ID if known"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Razón del ban</label>
                <select 
                  className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                >
                  <option value=""><s>Selecionar la razón</s></option>
                  <option value="Harassment">Acoso</option>
                  <option value="Spam">Spam</option>
                  <option value="Inappropriate Content">Contenido Inapropiado</option>
                  <option value="Hate Speech">Incitación al odio</option>
                  <option value="Violence/Threats">Violencia/Amenazas</option>
                  <option value="Identity Theft">Robo de identidad</option>
                  <option value="Copyright Infringement">Infracción de derechos de autor</option>
                  <option value="Bot Activity">Actividad de bots</option>
                  <option value="Multiple Violations">Multiple Infracciones</option>
                  <option value="Other">Otro</option>
                </select>
                {errors.reason && (
                  <div className="invalid-feedback">{errors.reason}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Tipo de ban</label>
                    <select 
                      className="form-select"
                      name="banType"
                      value={formData.banType}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                    >
                      <option value="Temporary">Temporal Ban</option>
                      <option value="Permanent">Permanente Ban</option>
                    </select>
                  </div>
                </div>
                
                {formData.banType === 'Temporary' && (
                  <>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Duracion *</label>
                        <input 
                          type="number"
                          className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          min="1"
                          disabled={isProcessing}
                        />
                        {errors.duration && (
                          <div className="invalid-feedback">{errors.duration}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Unidad</label>
                        <select 
                          className="form-select"
                          name="durationUnit"
                          value={formData.durationUnit}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                        >
                          <option value="hours">Horas</option>
                          <option value="days">Dias</option>
                          <option value="weeks">Semanas</option>
                          <option value="months">Meses</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Notas Adiccionales</label>
                <textarea 
                  className="form-control"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add any additional notes about this ban..."
                  disabled={isProcessing}
                ></textarea>
              </div>

              {formData.banType === 'Temporary' && formData.duration && (
                <div className="alert alert-info">
                  <strong>📅 La prohibición expirará:</strong> {calculateExpiryDate()?.toLocaleString()}
                </div>
              )}
              
              {formData.banType === 'Permanent' && (
                <div className="alert alert-danger">
                  <strong>⚠️ Esta es una prohibición permanente!</strong> El usuario no podrá acceder a la plataforma a menos que se le desbanee manualmente.
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-danger"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Baneando User...
                  </>
                ) : (
                  <>🔒 Ban User</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BanUserModal;