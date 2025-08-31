import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Form, Modal, Spinner } from 'react-bootstrap';
import { coursesAPI, ordersAPI, reviewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import CourseContentViewer from '../../components/Course/CourseContentViewer';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated && user) {
      checkPurchaseStatus();
    }
  }, [id, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const [courseResponse, reviewsResponse] = await Promise.all([
        coursesAPI.getById(id),
        coursesAPI.getReviews(id)
      ]);
      
      setCourse(courseResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      // Check if user is the instructor of this course
      if (course && course.instructor && course.instructor._id === user._id) {
        setHasPurchased(true); // Instructors can always access their own courses
        return;
      }

      // Check if user has purchased the course
      const response = await ordersAPI.getByUser(user._id);
      const userOrders = response.data;
      const purchased = userOrders.some(order => 
        order.course._id === id && order.status === 'paid'
      );
      setHasPurchased(purchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase courses');
      navigate('/login');
      return;
    }

    try {
      setPurchasing(true);
      
      // Create order
      const orderData = {
        userId: user._id,
        courseId: id,
        total: course.price,
        status: 'pending',
        paymentMethod: 'card'
      };

      const orderResponse = await ordersAPI.create(orderData);
      const order = orderResponse.data;

      // Process payment (mock)
      const paymentData = {
        orderId: order._id,
        paymentMethod: 'card',
        transactionId: `txn_${Date.now()}`
      };

      await ordersAPI.processPayment(paymentData);
      
      toast.success('Course purchased successfully!');
      setHasPurchased(true);
      fetchCourseDetails(); // Refresh course data
    } catch (error) {
      console.error('Error purchasing course:', error);
      const message = error.response?.data?.message || 'Failed to purchase course';
      toast.error(message);
    } finally {
      setPurchasing(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      setDeleting(true);
      await coursesAPI.delete(id);
      toast.success('Course deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasPurchased) {
      toast.error('You must purchase the course before reviewing');
      return;
    }

    try {
      const reviewData = {
        userId: user._id,
        courseId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };

      await reviewsAPI.create(reviewData);
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchCourseDetails(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'rating-stars' : 'text-muted'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  if (!course) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <Alert variant="danger">Course not found</Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Course Hero */}
      <section className="course-detail-hero">
        <Container>
          <Row>
            <Col lg={8}>
              <Badge bg="info" className="instructor-badge mb-3">
                {course.category || 'General'}
              </Badge>
              <h1 className="display-4 fw-bold mb-3">{course.title}</h1>
              <p className="lead mb-4">{course.description}</p>
              
              <div className="d-flex align-items-center mb-3">
                <div className="me-4">
                  {renderStars(course.averageRating || 0)}
                  <span className="ms-2">
                    ({course.averageRating || 0}) • {reviews.length} reviews
                  </span>
                </div>
                <div>
                  <strong>{course.totalStudents || 0}</strong> students enrolled
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <strong>Instructor:</strong> {course.instructor?.name}
                </div>
                <Badge bg="secondary">{course.level || 'Beginner'}</Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          <Col lg={8}>
            {/* Course Content */}
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <h4>About This Course</h4>
              </Card.Header>
              <Card.Body>
                <p>{course.description}</p>
                
                <h5>What You'll Learn:</h5>
                <ul>
                  <li>Master the fundamentals and advanced concepts</li>
                  <li>Build real-world projects and applications</li>
                  <li>Get hands-on experience with industry tools</li>
                  <li>Receive certificate upon completion</li>
                </ul>
              </Card.Body>
            </Card>

            {/* Reviews Section */}
            <Card className="dashboard-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4>Student Reviews ({reviews.length})</h4>
                {hasPurchased && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Write Review
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {reviews.length === 0 ? (
                  <p className="text-muted">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="review-card p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{review.user?.name}</strong>
                          <div>{renderStars(review.rating)}</div>
                        </div>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-0">{review.comment}</p>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Purchase Card */}
            <Card className="dashboard-card sticky-top" style={{ top: '100px' }}>
              <div className="course-image">
                📚
              </div>
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="price-tag">₹{course.price}</h2>
                </div>

                {hasPurchased ? (
                  <div className="text-center">
                    {course.instructor && course.instructor._id === user._id ? (
                      <Alert variant="info" className="mb-3">
                        👨‍🏫 This is your course
                      </Alert>
                    ) : (
                      <Alert variant="success" className="mb-3">
                        ✅ You have purchased this course
                      </Alert>
                    )}
                    <Button
                      variant="success"
                      size="lg"
                      className="w-100 mb-2"
                      onClick={() => document.getElementById('course-content').scrollIntoView({ behavior: 'smooth' })}
                    >
                      🎯 Access Course Content
                    </Button>
                    
                    {course.instructor && course.instructor._id === user._id && (
                      <>
                        <Button
                          variant="outline-primary"
                          size="lg"
                          className="w-100 mb-2"
                          onClick={() => navigate(`/edit-course/${course._id}`)}
                        >
                          ✏️ Edit Course
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="lg"
                          className="w-100 mb-2"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          🗑️ Delete Course
                        </Button>
                        <Button
                          variant="outline-info"
                          size="lg"
                          className="w-100"
                          onClick={() => navigate(`/course-students/${course._id}`)}
                        >
                          👥 View Students
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? 'Processing...' : 'Buy Now'}
                  </Button>
                )}

                <div className="text-center">
                  <small className="text-muted">
                    30-day money-back guarantee
                  </small>
                </div>

                <hr />

                <div>
                  <h6>This course includes:</h6>
                  <ul className="list-unstyled">
                    <li>📹 Video lectures</li>
                    <li>📄 Downloadable resources</li>
                    <li>🏆 Certificate of completion</li>
                    <li>♾️ Lifetime access</li>
                    <li>📱 Mobile and TV access</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Course Content Viewer - Only show after purchase */}
      {hasPurchased && course && user && (
        <div id="course-content">
          <CourseContentViewer course={course} user={user} />
        </div>
      )}

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleReviewSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({
                  ...reviewForm,
                  rating: parseInt(e.target.value)
                })}
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Good</option>
                <option value={2}>2 Stars - Fair</option>
                <option value={1}>1 Star - Poor</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({
                  ...reviewForm,
                  comment: e.target.value
                })}
                placeholder="Share your experience with this course..."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Course Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <h6>⚠️ Warning</h6>
            <p className="mb-0">
              Are you sure you want to delete "<strong>{course?.title}</strong>"? 
              This action cannot be undone and will permanently remove the course and all associated data.
            </p>
          </Alert>
          <div className="mt-3">
            <p><strong>This will delete:</strong></p>
            <ul>
              <li>The course content and materials</li>
              <li>All student enrollments</li>
              <li>Course reviews and ratings</li>
              <li>Associated PDF files</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteCourse}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Delete Course'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CourseDetail;