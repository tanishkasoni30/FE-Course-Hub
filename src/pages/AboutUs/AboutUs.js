import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Row, Col, Badge, Button, Form, Alert, Modal, ProgressBar } from 'react-bootstrap';
import { FaStar, FaUsers, FaBook, FaGraduationCap, FaComments, FaHeadset, FaRocket, FaShieldAlt, FaMobileAlt, FaGlobe } from 'react-icons/fa';
import { usersAPI } from '../../services/api';
import './AboutUs.css';

const AboutUs = () => {
  const { user, isAuthenticated } = useAuth();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [comment, setComment] = useState('');
  const [supportIssue, setSupportIssue] = useState('');
  const [supportCategory, setSupportCategory] = useState('general');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);

  // Fetch real instructor data
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setInstructorsLoading(true);
        const response = await usersAPI.getInstructors();
        setInstructors(response.data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setInstructors([]);
      } finally {
        setInstructorsLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Sample data - in real app, this would come from your backend
  const projectFeatures = [
    {
      icon: <FaBook className="feature-icon" />,
      title: "Comprehensive Course Library",
      description: "Access to hundreds of courses across various domains including programming, design, business, and more.",
      color: "primary"
    },
    {
      icon: <FaGraduationCap className="feature-icon" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and certified experts in their respective fields.",
      color: "success"
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Interactive Learning",
      description: "Engage with fellow learners through discussions, peer reviews, and collaborative projects.",
      color: "info"
    },
    {
      icon: <FaRocket className="feature-icon" />,
      title: "Flexible Learning Paths",
      description: "Customize your learning journey with personalized course recommendations and flexible schedules.",
      color: "warning"
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Secure Platform",
      description: "Your data and progress are protected with enterprise-grade security measures.",
      color: "danger"
    },
    {
      icon: <FaMobileAlt className="feature-icon" />,
      title: "Mobile Optimized",
      description: "Learn on-the-go with our mobile-responsive platform that works on all devices.",
      color: "secondary"
    }
  ];

  // Generate avatar emoji based on instructor name
  const getAvatarEmoji = (name) => {
    const firstLetter = name.charAt(0).toLowerCase();
    if (['a', 'e', 'i', 'o', 'u'].includes(firstLetter)) {
      return '👩‍🏫';
    } else {
      return '👨‍🏫';
    }
  };

  // Calculate real stats from instructor data
  const calculateStats = () => {
    if (instructors.length === 0) return [];
    
    const totalStudents = instructors.reduce((sum, instructor) => sum + instructor.totalStudents, 0);
    const totalCourses = instructors.reduce((sum, instructor) => sum + instructor.courses, 0);
    const totalInstructors = instructors.length;
    const averageRating = instructors.length > 0 
      ? (instructors.reduce((sum, instructor) => sum + instructor.averageRating, 0) / instructors.length).toFixed(1)
      : 0;

    return [
      { number: totalStudents.toLocaleString(), label: "Students Enrolled", icon: <FaUsers /> },
      { number: totalCourses.toString(), label: "Courses Available", icon: <FaBook /> },
      { number: totalInstructors.toString(), label: "Expert Instructors", icon: <FaGraduationCap /> },
      { number: `${averageRating}⭐`, label: "Average Rating", icon: <FaStar /> }
    ];
  };

  const stats = calculateStats();

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        user: user?.name || 'Anonymous',
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
        rating: 5
      };
      setComments([newComment, ...comments]);
      setComment('');
      setShowCommentModal(false);
    }
  };

  const handleSubmitSupport = (e) => {
    e.preventDefault();
    if (supportIssue.trim()) {
      // Here you would typically send to your backend
      console.log('Support Issue:', { category: supportCategory, issue: supportIssue });
      setSupportIssue('');
      setSupportCategory('general');
      setShowSupportModal(false);
      alert('Your support request has been submitted. We\'ll get back to you within 24 hours.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? 'text-warning' : 'text-muted'} 
        size={16}
      />
    ));
  };

  return (
    <div className="about-us-page">
      <div className="container mt-5 pt-5">
        {/* Hero Section */}
        <div className="hero-section text-center mb-5">
          <h1 className="hero-title">Welcome to CourseHub</h1>
          <p className="hero-subtitle">
            Empowering learners worldwide with quality education and expert knowledge
          </p>
          <div className="hero-stats">
            {instructorsLoading ? (
              <Row>
                {[1, 2, 3, 4].map((index) => (
                  <Col key={index} md={3} className="mb-3">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <div className="spinner-border spinner-border-sm text-white" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                      <div className="stat-number">...</div>
                      <div className="stat-label">Loading...</div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row>
                {stats.map((stat, index) => (
                  <Col key={index} md={3} className="mb-3">
                    <div className="stat-item">
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>

        {/* Project Features */}
        <section className="features-section mb-5">
          <h2 className="section-title text-center mb-4">
            <FaRocket className="me-2" />
            Why Choose CourseHub?
          </h2>
          <Row>
            {projectFeatures.map((feature, index) => (
              <Col key={index} lg={4} md={6} className="mb-4">
                <Card className="feature-card h-100">
                  <Card.Body className="text-center">
                    <div className={`feature-icon-wrapper bg-${feature.color}`}>
                      {feature.icon}
                    </div>
                    <Card.Title className="mt-3">{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Star Instructors */}
        <section className="instructors-section mb-5">
          <h2 className="section-title text-center mb-4">
            <FaStar className="me-2" />
            Meet Our Star Instructors
          </h2>
          
          {instructorsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading instructors...</p>
            </div>
          ) : instructors.length > 0 ? (
            <Row>
              {instructors.map((instructor, index) => (
                <Col key={instructor._id} lg={6} className="mb-4">
                  <Card className="instructor-card h-100">
                    <Card.Body>
                      <div className="instructor-header">
                        <div className="instructor-avatar">
                          <span className="avatar-text">{getAvatarEmoji(instructor.name)}</span>
                        </div>
                        <div className="instructor-info">
                          <h5 className="instructor-name">{instructor.name}</h5>
                          <p className="instructor-specialty">{instructor.specialty}</p>
                          <div className="instructor-rating">
                            {renderStars(instructor.averageRating)}
                            <span className="rating-text ms-2">{instructor.averageRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="instructor-stats">
                        <div className="stat">
                          <span className="stat-number">{instructor.totalStudents.toLocaleString()}</span>
                          <span className="stat-label">Students</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">{instructor.courses}</span>
                          <span className="stat-label">Courses</span>
                        </div>
                      </div>
                      <div className="instructor-achievements">
                        {instructor.achievements.map((achievement, idx) => (
                          <Badge key={idx} bg="light" className="me-2 mb-1">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FaGraduationCap size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No instructors found</h5>
              <p className="text-muted">Our instructors are currently setting up their courses.</p>
            </div>
          )}
        </section>

        {/* User Comments Section */}
        <section className="comments-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">
              <FaComments className="me-2" />
              What Our Users Say
            </h2>
            {isAuthenticated && (
              <Button 
                variant="primary" 
                onClick={() => setShowCommentModal(true)}
                className="add-comment-btn"
              >
                <FaComments className="me-2" />
                Add Comment
              </Button>
            )}
          </div>
          
          {comments.length > 0 ? (
            <Row>
              {comments.map((comment) => (
                <Col key={comment.id} lg={6} className="mb-3">
                  <Card className="comment-card">
                    <Card.Body>
                      <div className="comment-header">
                        <h6 className="comment-author">{comment.user}</h6>
                        <small className="text-muted">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="comment-text">{comment.comment}</p>
                      <div className="comment-rating">
                        {renderStars(comment.rating)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-4">
              <FaComments size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No comments yet</h5>
              <p className="text-muted">Be the first to share your experience!</p>
              {!isAuthenticated && (
                <Button variant="outline-primary" href="/login">
                  Login to Comment
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Support Section */}
        <section className="support-section mb-5">
          <Card className="support-card">
            <Card.Body className="text-center">
              <div className="support-icon mb-3">
                <FaHeadset size={48} className="text-primary" />
              </div>
              <h3>Need Help?</h3>
              <p className="text-muted mb-4">
                Facing any issues or have questions? Our support team is here to help you 24/7.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowSupportModal(true)}
              >
                <FaHeadset className="me-2" />
                Get Support
              </Button>
            </Card.Body>
          </Card>
        </section>

        {/* Comment Modal */}
        <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Share Your Experience</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitComment}>
              <Form.Group className="mb-3">
                <Form.Label>Your Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your learning experience..."
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Comment
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Support Modal */}
        <Modal show={showSupportModal} onHide={() => setShowSupportModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Submit Support Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitSupport}>
              <Form.Group className="mb-3">
                <Form.Label>Issue Category</Form.Label>
                <Form.Select 
                  value={supportCategory} 
                  onChange={(e) => setSupportCategory(e.target.value)}
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Payment</option>
                  <option value="course">Course Related</option>
                  <option value="account">Account Issues</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Describe Your Issue</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={supportIssue}
                  onChange={(e) => setSupportIssue(e.target.value)}
                  placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to do..."
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowSupportModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Support Request
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AboutUs;
