import React, { useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (auth?.isLoggedin) {
      navigate("/");
    }
  }, [auth, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/users/pre-register`, {
        email,
        password,
        confirmPassword,
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
          <h1>Sign Up</h1>
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
            <Form.Group id="password" className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              id="confirmPassword"
              className="my-2"
              controlId="confirmPassword"
            >
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password again"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              Already have an account? <Link to="/login">Sign In!</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
