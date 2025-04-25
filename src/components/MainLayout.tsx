import { Container, Nav, Navbar } from "react-bootstrap";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

const MainLayout: React.FC = () => {
  const context = useAuth();

  return (
    <>
      {/* --- Navbar --- */}
      <Navbar bg="dark" variant="dark" expand={"lg"}>
        <Container>
          <Navbar.Brand as={Link} to={"/"}>
            FinManager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={"/"}>
                Dashboard
              </Nav.Link>
            </Nav>
            {context.accessToken ? (
              <Nav>
                <Nav.Link as={Link} to={"/logout"} onClick={context.logout}>
                  Logout
                </Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={Link} to={"/login"}>
                  Login
                </Nav.Link>
              </Nav>
            )}
            {/*<Nav>*/}
            {/*  <Nav.Link as={Link} to={"/login"}>*/}
            {/*    Login*/}
            {/*  </Nav.Link>*/}
            {/*</Nav>*/}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- Main content --- */}
      <Container className={"mt-3"}>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
