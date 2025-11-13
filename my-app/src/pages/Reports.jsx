import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { useModal } from '../hooks/useModal';
import ReportDetailsModal from '../components/admin/ReportDetailsModal';

function Reports() {
  const {
    reports,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    hasMore,
    filters,
    handlePageChange,
    handleStatusFilter,
    handleDateFilter,
    handleContentTypeFilter,
    clearFilters,
    resolveReport,
    searchReports
  } = useReports();

  const { 
    isOpen: isModalOpen, 
    selectedItem: selectedReport, 
    openModal, 
    closeModal 
  } = useModal();

  // Estados locales para filtros avanzados
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewReport = (report) => {
    openModal(report);
  };

  const handleApproveReport = async (reportId, reason = '') => {
    const result = await resolveReport(reportId, true, reason);
    if (result.success) {
      closeModal();
    } else {
      alert(result.error || 'Error al aprobar el reporte');
    }
  };

  const handleRejectReport = async (reportId, reason = '') => {
    const result = await resolveReport(reportId, false, reason);
    if (result.success) {
      closeModal();
    } else {
      alert(result.error || 'Error al rechazar el reporte');
    }
  };

  const handleDateRangeChange = (type, value) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    
    if (newRange.start && newRange.end) {
      handleDateFilter(newRange.start, newRange.end);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchReports(searchTerm);
    }
  };

  const getReportTypeBadgeColor = (type) => {
    const colors = {
      'Spam': 'bg-warning',
      'Harassment': 'bg-danger',
      'Inappropriate Content': 'bg-info',
      'Fake Profile': 'bg-secondary',
      'Copyright Violation': 'bg-primary',
      'Violence': 'bg-dark',
      'Other': 'bg-light text-dark'
    };
    return colors[type] || 'bg-light text-dark';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Approved': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
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
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Reintentar
          </button>
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
              <h1 className="h3 mb-0">📊 Reports Management</h1>
              <p className="text-muted">Sistema completo para gestionar reports de usuarios</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                type="button"
              >
                🔍 {showAdvancedFilters ? 'Ocultar' : 'Filtros'} Avanzados
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Avanzados */}
      {showAdvancedFilters && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">🎯 Filtros Avanzados</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Búsqueda */}
                  <div className="col-md-4">
                    <label className="form-label">Buscar en reportes</label>
                    <form onSubmit={handleSearch} className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por usuario, motivo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-outline-primary" type="submit">
                        🔍
                      </button>
                    </form>
                  </div>

                  {/* Filtro por Fecha - Inicio */}
                  <div className="col-md-2">
                    <label className="form-label">📅 Fecha Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateRange.start}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    />
                  </div>

                  {/* Filtro por Fecha - Fin */}
                  <div className="col-md-2">
                    <label className="form-label">📅 Fecha Fin</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateRange.end}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    />
                  </div>

                  {/* Tipo de Contenido */}
                  <div className="col-md-3">
                    <label className="form-label">Tipo de Contenido</label>
                    <select 
                      className="form-select"
                      onChange={(e) => handleContentTypeFilter(e.target.value)}
                      value={filters.contentType || ''}
                    >
                      <option value="">Todos los tipos</option>
                      <option value="Spam">Spam</option>
                      <option value="Harassment">Harassment</option>
                      <option value="Inappropriate Content">Inappropriate Content</option>
                      <option value="Fake Profile">Fake Profile</option>
                      <option value="Copyright Violation">Copyright Violation</option>
                      <option value="Violence">Violence</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Botón Limpiar */}
                  <div className="col-md-1 d-flex align-items-end">
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        clearFilters();
                        setDateRange({ start: '', end: '' });
                        setSearchTerm('');
                      }}
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros por Estado */}
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="btn-group" role="group" aria-label="Filtros de estado">
            <button 
              className={`btn ${!filters.status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={clearFilters}
              type="button"
            >
              📋 Todos
            </button>
            <button 
              className={`btn ${filters.status === 'Pending' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => handleStatusFilter('Pending')}
              type="button"
            >
              ⏳ Pending
            </button>
            <button 
              className={`btn ${filters.status === 'Approved' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleStatusFilter('Approved')}
              type="button"
            >
              ✅ Approved
            </button>
            <button 
              className={`btn ${filters.status === 'Rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => handleStatusFilter('Rejected')}
              type="button"
            >
              ❌ Rejected
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <small className="text-muted">
            📊 Mostrando {reports.length} de {totalCount} reportes
            {filters.status && (
              <span className="badge bg-secondary ms-2">
                Filtrado: {filters.status}
              </span>
            )}
          </small>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">👤 Reporter</th>
                    <th scope="col">🎯 Reported User</th>
                    <th scope="col">📝 Reason</th>
                    <th scope="col">📊 Type</th>
                    <th scope="col">⚡ Status</th>
                    <th scope="col">📅 Date</th>
                    <th scope="col" className="text-center">🔧 Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="text-muted">
                          <i className="fas fa-inbox fa-3x mb-3"></i>
                          <h5>No reports found</h5>
                          <p>No se encontraron reportes con los filtros aplicados</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map(report => (
                      <tr key={report.id} className={report.status === 'Pending' ? 'table-warning' : ''}>
                        <td>
                          <span className="badge bg-light text-dark">#{report.id}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center">
                              <small className="text-white fw-bold">
                                {report.reporterUsername?.charAt(0)?.toUpperCase() || '?'}
                              </small>
                            </div>
                            <span>{report.reporterUsername}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center">
                              <small className="text-white fw-bold">
                                {report.reportedUsername?.charAt(0)?.toUpperCase() || '?'}
                              </small>
                            </div>
                            <span>{report.reportedUsername}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info text-wrap" style={{ maxWidth: '200px' }}>
                            {report.reason}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getReportTypeBadgeColor(report.contentType)}`}>
                            {report.contentType || 'Other'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(report.status)}`}>
                            {report.status}
                          </span>
                          {report.resolvedAt && (
                            <div className="small text-muted mt-1">
                              Resuelto: {new Date(report.resolvedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="small">
                            <div>{new Date(report.createdAt).toLocaleDateString()}</div>
                            <div className="text-muted">
                              {new Date(report.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewReport(report)}
                              title="Ver detalles"
                            >
                              👁️
                            </button>
                            {report.status === 'Pending' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleApproveReport(report.id)}
                                  title="Aprobar reporte"
                                >
                                  ✅
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRejectReport(report.id)}
                                  title="Rechazar reporte"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            {totalCount > pageSize && (
              <div className="card-footer">
                <nav aria-label="Reports pagination">
                  <ul className="pagination pagination-sm mb-0 justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Previous
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
                        Next →
                      </button>
                    </li>
                  </ul>
                </nav>
                
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Página {currentPage} de {Math.ceil(totalCount / pageSize)} | 
                    Total: {totalCount} reportes
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApproveReport}
        onReject={handleRejectReport}
      />

      <style jsx>{`
        .avatar-sm {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }
        
        .table-responsive {
          border-radius: 8px;
        }
        
        .card {
          border: none;
          border-radius: 12px;
        }
        
        .badge {
          font-size: 0.75em;
        }
        
        .btn-group .btn {
          border-radius: 4px;
          margin: 0 1px;
        }
        
        tr:hover {
          background-color: rgba(0,123,255,0.05);
        }
        
        .table-warning {
          background-color: rgba(255, 193, 7, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Reports;
