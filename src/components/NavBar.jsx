import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CartWidget from "./CartWidget";
import "../index.css";

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="custom-navbar"
      fixed="top"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/logoTicket.png"
            alt="Logo"
            height="42"
            className="me-2 navbar-logo"
          />
          <span className="fw-bold navbar-title">Las Puertas del Olimpo</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Inicio
            </Nav.Link>

            <NavDropdown
              title="Productos"
              id="productos-dropdown"
              menuVariant="dark"
              onClick={(e) => e.stopPropagation()}
            >
              <NavDropdown.Item as={Link} to="/category/metallica">
                Metallica
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/acdc">
                AC/DC
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/sylvania">
                Sylvania
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/linkin-park">
                Linkin Park
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/mago-de-oz">
                Mago de Oz
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/feuerschwanz">
                Feuerschwanz
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/">
                Ver todos
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/contacto" onClick={() => setExpanded(false)}>
              Contacto
            </Nav.Link>

            <NavDropdown
              title="Admin"
              id="admin-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item as={Link} to="/admin">
                Crear Show
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/manage">
                Gestionar Shows
              </NavDropdown.Item>
            </NavDropdown>

            <div className="ms-lg-3 mt-3 mt-lg-0">
              <CartWidget />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;