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
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
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
    if (password.length > 50) {
      return "Password must be less than 50 characters";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword.trim()) {
      return "Please confirm your password";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
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
    
    if (name === "name") {
      const nameError = validateName(value);
      if (nameError) {
        newValidationErrors.name = nameError;
      } else {
        delete newValidationErrors.name;
      }
    }
    
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
      
      // Also validate confirm password when password changes
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(value, formData.confirmPassword);
        if (confirmError) {
          newValidationErrors.confirmPassword = confirmError;
        } else {
          delete newValidationErrors.confirmPassword;
        }
      }
    }
    
    if (name === "confirmPassword") {
      const confirmError = validateConfirmPassword(formData.password, value);
      if (confirmError) {
        newValidationErrors.confirmPassword = confirmError;
      } else {
        delete newValidationErrors.confirmPassword;
      }
    }
    
    setValidationErrors(newValidationErrors);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    if (nameError || emailError || passwordError || confirmError) {
      setValidationErrors({
        name: nameError || "",
        email: emailError || "",
        password: passwordError || "",
        confirmPassword: confirmError || "",
      });
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/otp/send-otp",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      toast.success(response.data.message);
      setLoading(false);

      navigate("/verify-email", {
        state: {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: formData.role,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "OTP bhejne mein error hui.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Join CourseHub</h2>
                  <p className="text-muted">
                    Create your account to get started
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSendOtp}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      isInvalid={!!validationErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
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
                    <Form.Text className="text-muted">
                      Must be at least 6 characters long
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      isInvalid={!!validationErrors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading || Object.keys(validationErrors).length > 0}
                  >
                    {loading ? "Sending OTP..." : "Create Account"}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary text-decoration-none"
                    >
                      Sign in here
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

export default Register;
