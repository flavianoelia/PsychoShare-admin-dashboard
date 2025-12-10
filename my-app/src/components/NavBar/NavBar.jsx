import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const userEmail = localStorage.getItem('email');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">PsychoShare Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/reports">Reportes</Nav.Link>
            <Nav.Link as={Link} to="/admin/bans">Usuarios Baneados</Nav.Link>
            <Nav.Link as={Link} to="/admin/admins">Administradores</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <Navbar.Text className="me-3">
                  👤 {userEmail}
                </Navbar.Text>
                <Nav.Link onClick={handleLogout} style={{cursor: 'pointer'}}>
                  🚪 Cerrar Sesión
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                🔐 Iniciar Sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
