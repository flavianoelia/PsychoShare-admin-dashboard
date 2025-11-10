import React, { useState, useEffect } from 'react';

function Bans() {
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    const mockBans = [
      {
        id: 1,
        username: "banned_user_1",
        email: "banned1@example.com",
        reason: "Harassment",
        banDate: "2024-01-15",
        isActive: true,
        banType: "Temporary"
      },
      {
        id: 2,
        username: "spam_account",
        email: "spam@example.com", 
        reason: "Spam",
        banDate: "2024-01-10",
        isActive: false,
        banType: "Temporary"
      }
    ];
    
    setTimeout(() => {
      setBans(mockBans);
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
      <h1>🚫 Usuarios Baneados</h1>
      <p>Lista de usuarios con suspensiones activas</p>
      
      <div className="card">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Razón</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {bans.map(ban => (
                <tr key={ban.id}>
                  <td>#{ban.id}</td>
                  <td>
                    <div>
                      <div className="fw-bold">{ban.username}</div>
                      <small className="text-muted">{ban.email}</small>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {ban.reason}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ban.banType === 'Permanent' ? 'bg-danger' : 'bg-info'}`}>
                      {ban.banType}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ban.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {ban.isActive ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td>{new Date(ban.banDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bans;