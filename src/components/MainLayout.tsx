import {Container, Nav, Navbar} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";


const MainLayout: React.FC = () => {

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">FinManager</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/"}>Dashboard</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default MainLayout