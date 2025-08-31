import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="footer-brand mb-4">
              <div className="footer-logo d-flex align-items-center mb-3">
                <div className="footer-logo-icon me-2">🎓</div>
                <h5 className="mb-0">CourseHub</h5>
              </div>
              <p className="footer-description">
                Your premier destination for online learning. Discover, learn, and grow with our comprehensive course catalog designed for modern learners.
              </p>
              <div className="footer-social">
                <Button variant="outline-light" size="sm" className="social-btn me-2">
                  📧
                </Button>
                <Button variant="outline-light" size="sm" className="social-btn me-2">
                  🐦
                </Button>
                <Button variant="outline-light" size="sm" className="social-btn me-2">
                  📘
                </Button>
                <Button variant="outline-light" size="sm" className="social-btn">
                  💼
                </Button>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="footer-links">
                <li><a href="/" className="footer-link">🏠 Home</a></li>
                <li><a href="/courses" className="footer-link">📚 Courses</a></li>
                <li><a href="/about" className="footer-link">ℹ️ About</a></li>
                <li><a href="/contact" className="footer-link">📞 Contact</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h6 className="footer-title">Categories</h6>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">💻 Programming</a></li>
                <li><a href="#" className="footer-link">🎨 Design</a></li>
                <li><a href="#" className="footer-link">💼 Business</a></li>
                <li><a href="#" className="footer-link">📈 Marketing</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h6 className="footer-title">Support</h6>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">❓ Help Center</a></li>
                <li><a href="#" className="footer-link">📋 Terms of Service</a></li>
                <li><a href="#" className="footer-link">🔒 Privacy Policy</a></li>
                <li><a href="#" className="footer-link">📖 FAQ</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h6 className="footer-title">Connect</h6>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">📧 Email</a></li>
                <li><a href="#" className="footer-link">📱 Twitter</a></li>
                <li><a href="#" className="footer-link">📘 Facebook</a></li>
                <li><a href="#" className="footer-link">💼 LinkedIn</a></li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <div className="footer-divider"></div>
        
        <Row className="footer-bottom">
          <Col md={6} className="text-center text-md-start">
            <p className="footer-copyright mb-0">
              &copy; 2024 CourseHub. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="footer-made-with mb-0">
              Made with ❤️ for learners worldwide
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;