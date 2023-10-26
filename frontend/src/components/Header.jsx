import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/skyward.png";
import { useAuth } from "../context/auth";

const Header = () => {
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  const logoutHandler = () => {
    setAuth({ user: null, token: "", refreshToken: "", isLoggedin: false });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <header>
      <Navbar bg="light" variant="light" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="SkyShop" className="logo"></img>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!auth.isLoggedin && (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaSignInAlt style={{ marginBottom: "4px" }} />
                    <span style={{ marginLeft: "5px" }}>Sign In</span>
                  </Nav.Link>
                </LinkContainer>
              )}
              {auth.isLoggedin && (
                <NavDropdown
                  title={auth.user.name ? auth.user.name : auth.user.username}
                  id="username"
                >
                  <LinkContainer to={"/dashboard"}>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FaSignOutAlt style={{ marginBottom: "4px" }} />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
