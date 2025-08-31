import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    try {
      setLoading(true);
      await authAPI.forgotPassword(email);
      toast.success('OTP sent successfully to your email');
      setStep(2);
      setErrors({});
    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    try {
      setLoading(true);
      await authAPI.verifyOTP({ email, otp });
      toast.success('OTP verified successfully!');
      setStep(3);
      setErrors({});
    } catch (error) {
      console.error('OTP verification error:', error);
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.resetPassword({ email, otp, newPassword });
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Password reset error:', error);
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await authAPI.resendOTP(email);
      toast.success('New OTP sent successfully!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <Form onSubmit={handleEmailSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          placeholder="Enter your email address"
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          We'll send a 6-digit OTP to your email address.
        </Form.Text>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          Back to Login
        </Button>
      </div>
    </Form>
  );

  const renderOTPStep = () => (
    <Form onSubmit={handleOTPSubmit}>
      <Alert variant="info">
        <h6>📧 Check Your Email</h6>
        <p className="mb-0">
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label>Enter OTP</Form.Label>
        <Form.Control
          type="text"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            if (errors.otp) setErrors({ ...errors, otp: '' });
          }}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          isInvalid={!!errors.otp}
        />
        <Form.Control.Feedback type="invalid">
          {errors.otp}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          The OTP is valid for 10 minutes.
        </Form.Text>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Verifying OTP...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>
        
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleResendOTP}
            disabled={loading}
            className="text-decoration-none"
          >
            Didn't receive OTP? Resend
          </Button>
        </div>
        
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => setStep(1)}
          disabled={loading}
        >
          Change Email
        </Button>
      </div>
    </Form>
  );

  const renderPasswordStep = () => (
    <Form onSubmit={handlePasswordReset}>
      <Alert variant="success">
        <h6>✅ OTP Verified</h6>
        <p className="mb-0">
          Please enter your new password below.
        </p>
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
          }}
          placeholder="Enter new password"
          isInvalid={!!errors.newPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.newPassword}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Password must be at least 6 characters long.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
          }}
          placeholder="Confirm new password"
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button
          type="submit"
          variant="success"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => setStep(2)}
          disabled={loading}
        >
          Back to OTP
        </Button>
      </div>
    </Form>
  );

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="dashboard-card">
            <Card.Header className="text-center">
              <h3 className="mb-0">
                {step === 1 && '🔐 Forgot Password'}
                {step === 2 && '📧 Enter OTP'}
                {step === 3 && '🔑 Reset Password'}
              </h3>
              <p className="text-muted mb-0">
                {step === 1 && 'Enter your email to receive a reset OTP'}
                {step === 2 && 'Enter the 6-digit code sent to your email'}
                {step === 3 && 'Create a new password for your account'}
              </p>
            </Card.Header>
            <Card.Body>
              {step === 1 && renderEmailStep()}
              {step === 2 && renderOTPStep()}
              {step === 3 && renderPasswordStep()}
            </Card.Body>
            <Card.Footer className="text-center">
              <small className="text-muted">
                Remember your password?{' '}
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
