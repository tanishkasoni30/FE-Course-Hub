import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, coursesAPI, ordersAPI } from '../../services/api';
import { CourseSkeletonGrid } from '../../components/UI/CourseSkeleton';
import { getCourseRecommendations } from '../../services/geminiService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Programming',
    level: 'Beginner',
    youtubeVideoUrl: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      if (user.role === 'student') {
        getAIRecommendations();
      }
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getDashboard(user._id);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getAIRecommendations = async () => {
    try {
      setAiLoading(true);
      const recommendations = await getCourseRecommendations(
        'Programming, Web Development, Data Science',
        'Beginner',
        'Build a career in tech'
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      // Don't show error toast for AI recommendations
    } finally {
      setAiLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const courseData = {
        ...courseForm,
        instructor: user._id,
        price: parseFloat(courseForm.price)
      };

      await coursesAPI.create(courseData);
      toast.success('Course created successfully!');
      setShowCourseModal(false);
      setCourseForm({
        title: '',
        description: '',
        price: '',
        category: 'Programming',
        level: 'Beginner',
        youtubeVideoUrl: '',
        notes: ''
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating course:', error);
      const message = error.response?.data?.message || 'Failed to create course';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 fw-bold">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="lead text-muted">
              Loading your dashboard...
            </p>
          </Col>
        </Row>
        
        {/* Stats Cards Skeleton */}
        <Row className="mb-4">
          {[...Array(4)].map((_, index) => (
            <Col md={3} className="mb-3" key={index}>
              <div className="stats-card skeleton-stats">
                <div className="skeleton-number"></div>
                <div className="skeleton-text"></div>
              </div>
            </Col>
          ))}
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="dashboard-card">
              <Card.Header>
                <h4>Your Courses</h4>
              </Card.Header>
              <Card.Body>
                <CourseSkeletonGrid count={6} />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <h5>Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="skeleton-button"></div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <div className="text-center">
          <h3>Failed to load dashboard</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="lead text-muted">
            {user.role === 'instructor' ? 'Manage your courses and track your success' : 'Continue your learning journey'}
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        {user.role === 'instructor' ? (
          <>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <h3>{dashboardData.stats.totalCourses || 0}</h3>
                <p>Total Courses</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <h3>{dashboardData.stats.totalStudents || 0}</h3>
                <p>Total Students</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <h3>₹{dashboardData.stats.totalRevenue || 0}</h3>
                <p>Total Revenue</p>
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <div className="stats-card">
                <h3>4.8</h3>
                <p>Avg Rating</p>
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col md={4} className="mb-3">
              <div className="stats-card">
                <h3>{dashboardData.stats.coursesEnrolled || 0}</h3>
                <p>Courses Enrolled</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="stats-card">
                <h3>85%</h3>
                <p>Completion Rate</p>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="stats-card">
                <h3>12</h3>
                <p>Certificates Earned</p>
              </div>
            </Col>
          </>
        )}
      </Row>

      <Row>
        <Col lg={8}>
          {/* Main Content */}
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>
                {user.role === 'instructor' ? 'Your Courses' : 'Your Enrolled Courses'}
              </h4>
              {user.role === 'instructor' && (
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary"
                    onClick={() => setShowCourseModal(true)}
                  >
                    Create New Course
                  </Button>
                  <Button 
                    variant="outline-primary"
                    href="/create-course"
                  >
                    Advanced Course Creator
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              {user.role === 'instructor' ? (
                // Instructor's courses
                dashboardData.courses && dashboardData.courses.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Students</th>
                        <th>Revenue</th>
                        <th>Rating</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.courses.map((course) => (
                        <tr key={course._id}>
                          <td>
                            <strong>{course.title}</strong>
                            <br />
                            <small className="text-muted">₹{course.price}</small>
                          </td>
                          <td>{course.totalStudents || 0}</td>
                          <td>₹{(course.totalStudents || 0) * course.price}</td>
                          <td>
                            <span className="rating-stars">★</span>
                            {course.averageRating || 0}
                          </td>
                          <td>
                            <Badge bg={course.isActive ? 'success' : 'secondary'}>
                              {course.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <br />
                            <Button
                              variant="outline-primary"
                              size="sm"
                              href={`/courses/${course._id}`}
                              className="mt-1"
                            >
                              View Course
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <h5>No courses yet</h5>
                    <p className="text-muted">Create your first course to get started!</p>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button 
                        variant="primary"
                        onClick={() => setShowCourseModal(true)}
                      >
                        Create Course
                      </Button>
                      <Button 
                        variant="outline-primary"
                        href="/create-course"
                      >
                        Advanced Creator
                      </Button>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">
                        Once you create courses, you'll be able to view and edit them here
                      </small>
                    </div>
                  </div>
                )
              ) : (
                // Student's enrolled courses
                dashboardData.purchasedCourses && dashboardData.purchasedCourses.length > 0 ? (
                  <Row>
                    {dashboardData.purchasedCourses.map((order) => (
                      <Col md={6} className="mb-3" key={order._id}>
                        <Card>
                          <Card.Body>
                            <h6>{order.course.title}</h6>
                            <p className="text-muted small">
                              Purchased on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <Button variant="outline-primary" size="sm">
                              Continue Learning
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center py-4">
                    <h5>No courses enrolled yet</h5>
                    <p className="text-muted">Start learning by enrolling in a course!</p>
                    <Button variant="primary" href="/courses">
                      Browse Courses
                    </Button>
                  </div>
                )
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Sidebar */}
          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              {user.role === 'instructor' ? (
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => setShowCourseModal(true)}>
                    Create New Course
                  </Button>
                  <Button variant="outline-primary" href="/create-course">
                    Advanced Course Creator
                  </Button>
                  {dashboardData.courses && dashboardData.courses.length > 0 && (
                    <Button variant="outline-info" href="/courses">
                      Browse All Courses
                    </Button>
                  )}
                  <Button variant="outline-primary">
                    View Analytics
                  </Button>
                  <Button variant="outline-secondary">
                    Manage Students
                  </Button>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <Button variant="primary" href="/courses">
                    Browse Courses
                  </Button>
                  <Button variant="outline-primary" href="/ai-assistant">
                    🤖 AI Assistant
                  </Button>
                  <Button variant="outline-primary">
                    My Certificates
                  </Button>
                  <Button variant="outline-secondary">
                    Learning Progress
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* AI Recommendations for Students */}
          {user.role === 'student' && (
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <h5>🤖 AI Recommendations</h5>
              </Card.Header>
              <Card.Body>
                {aiLoading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Getting personalized recommendations...</p>
                  </div>
                ) : aiRecommendations ? (
                  <div>
                    <Alert variant="info" className="mb-3">
                      <strong>Personalized for you!</strong>
                    </Alert>
                    <div className="ai-recommendations">
                      <pre className="recommendations-text">{aiRecommendations}</pre>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="mt-2"
                      onClick={getAIRecommendations}
                    >
                      🔄 Refresh Recommendations
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted">Get AI-powered course recommendations</p>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={getAIRecommendations}
                    >
                      Get Recommendations
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          <Card className="dashboard-card">
            <Card.Header>
              <h5>Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-item mb-3">
                <small className="text-muted">2 hours ago</small>
                <p className="mb-0">Course "React Fundamentals" was updated</p>
              </div>
              <div className="activity-item mb-3">
                <small className="text-muted">1 day ago</small>
                <p className="mb-0">New student enrolled in "JavaScript Basics"</p>
              </div>
              <div className="activity-item">
                <small className="text-muted">3 days ago</small>
                <p className="mb-0">Received 5-star review</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Course Modal */}
      <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Course</Modal.Title>
          <Modal.Title as="h6" className="text-muted mt-2">
            💡 Tip: Use the Advanced Course Creator for PDF uploads and more features
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCourseSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({
                      ...courseForm,
                      title: e.target.value
                    })}
                    placeholder="Enter course title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({
                      ...courseForm,
                      price: e.target.value
                    })}
                    placeholder="Enter price"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={courseForm.description}
                onChange={(e) => setCourseForm({
                  ...courseForm,
                  description: e.target.value
                })}
                placeholder="Describe your course"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({
                      ...courseForm,
                      category: e.target.value
                    })}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Photography">Photography</option>
                    <option value="Music">Music</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({
                      ...courseForm,
                      level: e.target.value
                    })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>YouTube Video URL *</Form.Label>
              <Form.Control
                type="url"
                value={courseForm.youtubeVideoUrl}
                onChange={(e) => setCourseForm({
                  ...courseForm,
                  youtubeVideoUrl: e.target.value
                })}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <Form.Text className="text-muted">
                Paste the YouTube video URL that contains your course content
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Notes *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={courseForm.notes}
                onChange={(e) => setCourseForm({
                  ...courseForm,
                  notes: e.target.value
                })}
                placeholder="Add additional notes, learning objectives, or course outline..."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCourseModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Course
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Dashboard;