import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">PsychoShare Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Panel Principal</Nav.Link>
            <Nav.Link as={Link} to="/admin/users">Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/admin/reports">Reportes</Nav.Link>
            <Nav.Link as={Link} to="/admin/bans">Usuarios Baneados</Nav.Link>
            <Nav.Link as={Link} to="/admin/admins">Administradores</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
