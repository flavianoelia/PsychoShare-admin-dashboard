import React from 'react';
import './Error.css';

function Error() {
  return (
    <div className="container mt-4 text-center">
      <h1>404 - Página no encontrada</h1>
      <div className="panda-container">
        <img src="/panda404.jpg" alt="Panda comiendo bamboo" className="panda-image" />
      </div>
      <p>¡Ups! Este panda está comiendo bamboo y no encuentra la página que buscas.</p>
    </div>
  );
}

export default Error;