import React, { useState, useEffect } from 'react';

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data simple para probar
    const mockReports = [
      {
        id: 1,
        reporterUsername: "user123",
        reportedUsername: "reported_user",
        reason: "Harassment",
        status: "Pending",
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        reporterUsername: "moderator1",
        reportedUsername: "spam_user", 
        reason: "Spam",
        status: "Approved",
        createdAt: "2024-01-14T09:15:00Z"
      }
    ];
    
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

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

  return (
    <div className="container mt-4">
      <h1>📋 Reports Management</h1>
      <p>Sistema de gestión de reportes</p>
      
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
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>#{report.id}</td>
                  <td>{report.reporterUsername}</td>
                  <td>{report.reportedUsername}</td>
                  <td>
                    <span className="badge bg-info">{report.reason}</span>
                  </td>
                  <td>
                    <span className={`badge ${report.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;