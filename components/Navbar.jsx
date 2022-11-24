import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function Navbars() {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Metodos numericos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="me-auto"
            // style={{
            //   display: "flex",
            //   flexDirection: "row",
            //   justifyContent: "space-between",
            //   width: "100%",
            // }}
          >
            {/* <Link href="/trapezoidal" className="nav-link">
              Polinomial
            </Link>

            <Link href="/trapezoidal" className="nav-link">
              Regla Trapezoidal
            </Link>

            <Link href="/trapezoidal" className="nav-link">
              Regla Simpson
            </Link> */}

            <NavDropdown title="Herramientas online" id="basic-nav-dropdown">
              <Link
                href="/trapezoidal/online"
                className="dropdown-item"
                style={{ textDecoration: "none" }}
              >
                Regla Trapezoidal
              </Link>

              <Link
                href="/simpson/online"
                className="dropdown-item"
                style={{ textDecoration: "none" }}
              >
                Regla Simpson
              </Link>

              <NavDropdown.Divider />
              <Link
                href="/polinomial/online"
                className="dropdown-item"
                style={{ textDecoration: "none" }}
              >
                Regresión polinomial
              </Link>
              <Link
                href="/minimoCuadrado/online"
                className="dropdown-item"
                style={{ textDecoration: "none" }}
              >
                Minimo Cuadrado
              </Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
