import React, { useState, useEffect } from 'react';

function BanUserModal({ isOpen, onClose, onBan, userToBan }) {
  const [formData, setFormData] = useState({
    username: '',
    userId: '',
    email: '',
    reason: '',
    banType: 'Temporary',
    duration: '7',
    durationUnit: 'days',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-llenar formulario si viene userToBan desde un reporte
  useEffect(() => {
    if (userToBan) {
      console.log('🔍 userToBan recibido:', userToBan);
      console.log('🔍 username:', userToBan.username);
      console.log('🔍 email:', userToBan.email);
      console.log('🔍 userId:', userToBan.userId);
      
      setFormData(prev => ({
        ...prev,
        username: userToBan.username || userToBan.email || '',
        userId: userToBan.userId || '',
        email: userToBan.email || ''
      }));
    }
  }, [userToBan]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    if (formData.banType === 'Temporary') {
      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration = 'Duration must be greater than 0';
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
    if (formData.banType === 'Permanent') return null;
    
    const now = new Date();
    const duration = parseInt(formData.duration);
    
    switch (formData.durationUnit) {
      case 'hours':
        return new Date(now.getTime() + duration * 60 * 60 * 1000);
      case 'days':
        return new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
      case 'weeks':
        return new Date(now.getTime() + duration * 7 * 24 * 60 * 60 * 1000);
      case 'months':
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
        duration: formData.banType === 'Permanent' ? null : `${formData.duration} ${formData.durationUnit}`,
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
          banType: 'Temporary',
          duration: '7',
          durationUnit: 'days',
          notes: ''
        });
        setErrors({});
        onClose();
        alert('User banned successfully!');
      } else {
        alert(result.error || 'Error banning user');
      }
    } catch (error) {
      console.error('Error submitting ban:', error);
      alert('Error banning user. Please try again.');
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
        banType: 'Temporary',
        duration: '7',
        durationUnit: 'days',
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
              aria-label="Close"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-warning">
                <strong>⚠️ Warning:</strong> Banning a user will prevent them from accessing the platform. 
                Make sure you have reviewed the case thoroughly.
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
                    <label className="form-label">User ID (optional)</label>
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
                <label className="form-label">Reason for Ban *</label>
                <select 
                  className={`form-select ${errors.reason ? 'is-invalid' : ''}`}
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                >
                  <option value="">Select a reason</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Spam">Spam</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Hate Speech">Hate Speech</option>
                  <option value="Violence/Threats">Violence/Threats</option>
                  <option value="Identity Theft">Identity Theft</option>
                  <option value="Copyright Infringement">Copyright Infringement</option>
                  <option value="Bot Activity">Bot Activity</option>
                  <option value="Multiple Violations">Multiple Violations</option>
                  <option value="Other">Other</option>
                </select>
                {errors.reason && (
                  <div className="invalid-feedback">{errors.reason}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Ban Type</label>
                    <select 
                      className="form-select"
                      name="banType"
                      value={formData.banType}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                    >
                      <option value="Temporary">Temporary Ban</option>
                      <option value="Permanent">Permanent Ban</option>
                    </select>
                  </div>
                </div>
                
                {formData.banType === 'Temporary' && (
                  <>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Duration *</label>
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
                        <label className="form-label">Unit</label>
                        <select 
                          className="form-select"
                          name="durationUnit"
                          value={formData.durationUnit}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Additional Notes</label>
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
                  <strong>📅 Ban will expire:</strong> {calculateExpiryDate()?.toLocaleString()}
                </div>
              )}
              
              {formData.banType === 'Permanent' && (
                <div className="alert alert-danger">
                  <strong>⚠️ This is a permanent ban!</strong> The user will not be able to access the platform unless manually unbanned.
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
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-danger"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Banning User...
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