import React from "react";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";

function Sidebar(props) {
  const navigate = useNavigate();
  return (
    <Nav
      activeKey={props.page}
      variant="pills"
      fill
      onSelect={(selectedKey) => navigate(selectedKey)}
    >
      <Nav.Item>
        <Nav.Link eventKey="/dashboard">Dashboard</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/ad/create">Create Ad</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Sidebar;
