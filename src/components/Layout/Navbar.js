import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className={`shadow-sm fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease'
      }}
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="brand-logo d-flex align-items-center">
            <div className="logo-icon me-2">🎓</div>
            <span className="brand-text">CourseHub</span>
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link className="nav-link-custom">
                <span className="nav-icon">🏠</span>
                Home
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/courses">
              <Nav.Link className="nav-link-custom">
                <span className="nav-icon">📚</span>
                Courses
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/ai-assistant">
              <Nav.Link className="nav-link-custom">
                <span className="nav-icon">🤖</span>
                AI Assistant
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about-us">
              <Nav.Link className="nav-link-custom">
                <span className="nav-icon">ℹ️</span>
                About Us
              </Nav.Link>
            </LinkContainer>
            {isAuthenticated && user?.role === 'instructor' && (
              <LinkContainer to="/create-course">
                <Nav.Link className="nav-link-custom">
                  <span className="nav-icon">➕</span>
                  Create Course
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <LinkContainer to="/dashboard">
                  <Nav.Link className="nav-link-custom">
                    <span className="nav-icon">📊</span>
                    Dashboard
                  </Nav.Link>
                </LinkContainer>
                <NavDropdown 
                  title={
                    <div className="user-profile d-flex align-items-center">
                      <div className="user-avatar me-2">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="user-name">{user?.name}</span>
                    </div>
                  } 
                  id="user-dropdown"
                  className="user-dropdown-custom"
                >
                  <div className="dropdown-header">
                    <strong>Welcome back!</strong>
                    <small className="d-block text-muted">{user?.email}</small>
                  </div>
                  <NavDropdown.Divider />
                  <LinkContainer to="/profile">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <span className="dropdown-icon">👤</span>
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/settings">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <span className="dropdown-icon">⚙️</span>
                      Settings
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout} className="dropdown-item-custom logout-item">
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <Button variant="outline-primary" size="sm" className="auth-btn">
                      <span className="btn-icon">🔑</span>
                      Login
                    </Button>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <Button variant="primary" size="sm" className="auth-btn ms-2">
                      <span className="btn-icon">✨</span>
                      Get Started
                    </Button>
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;