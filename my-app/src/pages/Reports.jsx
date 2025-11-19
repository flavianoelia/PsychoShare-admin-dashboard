import React from 'react';
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
    clearFilters,
    resolveReport
  } = useReports();

  const { 
    isOpen: isModalOpen, 
    selectedItem: selectedReport, 
    openModal, 
    closeModal 
  } = useModal();

  const handleNewReport = () => {
    console.log('Create new report');
  };

  const handleViewReport = (report) => {
    openModal(report);
  };

  const handleApproveReport = async (reportId, reason = '') => {
    const result = await resolveReport(reportId, true, reason);
    if (result.success) {
      closeModal();
    } else {
      alert(result.error);
    }
  };

  const handleRejectReport = async (reportId, reason = '') => {
    const result = await resolveReport(reportId, false, reason);
    if (result.success) {
      closeModal();
    } else {
      alert(result.error);
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h1>Reports Management</h1>
      </div>

      {/* Filtros de Estado */}
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="btn-group" role="group">
            <button 
              className={`btn ${!filters.status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={clearFilters}
              type="button"
            >
              All
            </button>
            <button 
              className={`btn ${filters.status === 'Pending' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => handleStatusFilter('Pending')}
              type="button"
            >
              Pending
            </button>
            <button 
              className={`btn ${filters.status === 'Approved' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleStatusFilter('Approved')}
              type="button"
            >
              Approved
            </button>
            <button 
              className={`btn ${filters.status === 'Rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => handleStatusFilter('Rejected')}
              type="button"
            >
              Rejected
            </button>
          </div>
        </div>
        <div className="col-md-4 text-end">
          <small className="text-muted">
            Showing {reports.length} of {totalCount} reports
          </small>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Tipo de Contenido</label>
          <select 
            className="form-select form-select-sm"
            value={filters.contentType || ''}
            onChange={(e) => handleStatusFilter('contentType', e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Post">Post</option>
            <option value="Comment">Comment</option>
            <option value="Profile">Profile</option>
            <option value="Message">Message</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Fecha Desde</label>
          <input 
            type="date"
            className="form-control form-control-sm"
            value={filters.dateFrom || ''}
            onChange={(e) => handleStatusFilter('dateFrom', e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Fecha Hasta</label>
          <input 
            type="date"
            className="form-control form-control-sm"
            value={filters.dateTo || ''}
            onChange={(e) => handleStatusFilter('dateTo', e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Acciones</label>
          <div>
            <button 
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={clearFilters}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reporter</th>
                    <th>Reported User</th>
                    <th>Tipo</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <em>No reports found</em>
                      </td>
                    </tr>
                  ) : (
                    reports.map(report => (
                      <tr key={report.id}>
                        <td>#{report.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                              {report.reporterUsername?.charAt(0)?.toUpperCase()}
                            </div>
                            <span>{report.reporterUsername}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-secondary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                              {report.reportedUsername?.charAt(0)?.toUpperCase()}
                            </div>
                            <span>{report.reportedUsername}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {report.contentType || 'Post'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {report.reason}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            report.status === 'Pending' ? 'bg-warning' : 
                            report.status === 'Approved' ? 'bg-success' : 
                            report.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td>{new Date(report.reportDate || report.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewReport(report)}
                              title="Ver Detalles"
                            >
                              👁️
                            </button>
                            {report.status === 'Pending' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleApproveReport(report.id)}
                                  title="Aprobar"
                                >
                                  ✅
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRejectReport(report.id)}
                                  title="Rechazar"
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
      
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApproveReport}
        onReject={handleRejectReport}
      />
    </div>
  );
}

export default Reports;
