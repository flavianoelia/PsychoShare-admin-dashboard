import React from 'react';

function Home() {
  return (
    <div className="container mt-4">
      <h1>Panel Administrativo</h1>
      <p>Bienvenido al Dashboard de PsychoShare</p>
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Usuarios Totales</h5>
              <p className="card-text display-4">150</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Reportes Pendientes</h5>
              <p className="card-text display-4">8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;