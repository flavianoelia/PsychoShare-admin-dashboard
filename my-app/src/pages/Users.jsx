import React from 'react';
import { useParams } from 'react-router-dom';

function Users() {
  const { userId } = useParams();

  return (
    <div className="container mt-4">
      <h1>Gestión de Usuarios</h1>
      {userId ? (
        <p>Usuario ID: {userId}</p>
      ) : (
        <p>Lista de usuarios del sistema</p>
      )}
    </div>
  );
}

export default Users;