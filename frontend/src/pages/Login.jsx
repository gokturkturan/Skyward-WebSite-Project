import React, { useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (auth?.isLoggedin) {
      navigate(redirect);
    }
  }, [auth, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/users/login`, {
        email,
        password,
      });
      setAuth({ ...data, isLoggedin: true });
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...data, isLoggedin: true })
      );
      toast.success("You have successfully logged in");
      setIsLoading(false);
      navigate(redirect);
    } catch (error) {
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="border rounded-4 mt-5" xs={15} md={8} sm={10} lg={4}>
          <h1>Sign In</h1>
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
              id="forgotpassword"
              className="my-2"
              controlId="forgotpassword"
            >
              <Link to={"/forgot-password"}>Forgot Password?</Link>
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
              Don't have an account yet? <Link to="/register">Sign Up!</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
