import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/users/forgot-password`, {
        email,
      });
      toast.success(data.message);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="border rounded-4 mt-5" xs={15} md={8} sm={10} lg={4}>
          <h1>Forgot Password</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group id="email" className="my-2" controlId="email">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              <Link to="/login">Return to login page</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
