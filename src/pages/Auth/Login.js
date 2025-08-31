import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear general error when user starts typing
    if (error) {
      setError("");
    }

    // Real-time validation
    let newValidationErrors = { ...validationErrors };
    
    if (name === "email") {
      const emailError = validateEmail(value);
      if (emailError) {
        newValidationErrors.email = emailError;
      } else {
        delete newValidationErrors.email;
      }
    }
    
    if (name === "password") {
      const passwordError = validatePassword(value);
      if (passwordError) {
        newValidationErrors.password = passwordError;
      } else {
        delete newValidationErrors.password;
      }
    }
    
    setValidationErrors(newValidationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setValidationErrors({
        email: emailError || "",
        password: passwordError || "",
      });
      return;
    }
    
    setLoading(true);
    setError("");

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Welcome</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      isInvalid={!!validationErrors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                    <div className="text-end mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-primary text-decoration-none small"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading || Object.keys(validationErrors).length > 0}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary text-decoration-none"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
