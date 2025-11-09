import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/admin/reportsService';

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getAllReports();
      setReports(data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleNewReport = () => {
    console.log('Create new report');
  };

  const handleViewReport = (reportId) => {
    console.log('View report:', reportId);
  };

  const handleApproveReport = (reportId) => {
    console.log('Approve report:', reportId);
  };

  const handleRejectReport = (reportId) => {
    console.log('Reject report:', reportId);
  };

  if (loading) return <div className="container mt-4"><h3>Loading reports...</h3></div>;
  if (error) return <div className="container mt-4"><h3 className="text-danger">{error}</h3></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reports Management</h1>
        <button 
          className="btn btn-primary"
          onClick={handleNewReport}
        >
          + New Report
        </button>
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
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.reporterUserId}</td>
                      <td>{report.reportedUserId}</td>
                      <td>{report.reason}</td>
                      <td>
                        <span className={`badge ${report.status === 'Pending' ? 'bg-warning' : 
                          report.status === 'Approved' ? 'bg-success' : 'bg-danger'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewReport(report.id)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleApproveReport(report.id)}
                            title="Approve Report"
                          >
                            ✅
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRejectReport(report.id)}
                            title="Reject Report"
                          >
                            ❌
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;