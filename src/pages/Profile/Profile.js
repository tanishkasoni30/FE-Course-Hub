import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, coursesAPI, reviewsAPI } from '../../services/api';
import { Card, Row, Col, Badge, Table, ProgressBar, Button, Alert } from 'react-bootstrap';
import { FaUser, FaGraduationCap, FaBook, FaUsers, FaStar, FaDollarSign, FaChartLine } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (user?.role === 'instructor') {
          // Fetch instructor-specific data
          const [userData, coursesData] = await Promise.all([
            usersAPI.getById(user._id),
            coursesAPI.getByInstructor(user._id)
          ]);
          
          // Fetch reviews and calculate stats for all courses
          const coursesWithReviews = await Promise.all(
            coursesData.data.map(async (course) => {
              try {
                const reviews = await reviewsAPI.getByCourse(course._id);
                const averageRating = reviews.data && reviews.data.length > 0 
                  ? (reviews.data.reduce((acc, review) => acc + review.rating, 0) / reviews.data.length).toFixed(1)
                  : 0;
                
                return {
                  ...course,
                  reviews: reviews.data || [],
                  averageRating: parseFloat(averageRating),
                  totalStudents: 0 // This will be updated when we have order data
                };
              } catch (reviewError) {
                console.warn(`Failed to fetch reviews for course ${course._id}:`, reviewError);
                return {
                  ...course,
                  reviews: [],
                  averageRating: 0,
                  totalStudents: 0
                };
              }
            })
          );
          
          // Calculate total stats
          const totalStudents = 0; // Placeholder - would need backend endpoint for this
          const totalRevenue = 0; // Placeholder - would need backend endpoint for this
          const averageRating = coursesWithReviews.length > 0 
            ? (coursesWithReviews.reduce((acc, course) => acc + course.averageRating, 0) / coursesWithReviews.length).toFixed(1)
            : 0;
          
          setProfileData({
            user: userData.data,
            courses: coursesWithReviews,
            stats: {
              totalCourses: coursesWithReviews.length,
              totalStudents,
              totalRevenue,
              averageRating
            }
          });
        } else {
          // Fetch student-specific data
          const [userData, purchasedCourses] = await Promise.all([
            usersAPI.getById(user._id),
            usersAPI.getPurchasedCourses(user._id)
          ]);
          
          setProfileData({
            user: userData.data,
            purchasedCourses: purchasedCourses.data || [],
            stats: {
              coursesEnrolled: purchasedCourses.data ? purchasedCourses.data.length : 0
            }
          });
        }
      } catch (err) {
        console.error('Profile data fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  // Function to navigate to course detail page
  const handleContinueLearning = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (!profileData) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">No profile data available</Alert>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container mt-5 pt-5">
        {/* Profile Header */}
        <Card className="profile-header mb-4">
          <Card.Body className="text-center">
            <div className="profile-avatar mb-3">
              <FaUser size={60} className="text-primary" />
            </div>
            <h2 className="profile-name">{profileData.user.name}</h2>
            <p className="profile-email text-muted">{profileData.user.email}</p>
            <Badge 
              bg={profileData.user.role === 'instructor' ? 'success' : 'info'} 
              className="profile-role"
            >
              {profileData.user.role === 'instructor' ? 'Instructor' : 'Student'}
            </Badge>
            <p className="profile-joined mt-2 text-muted">
              Member since {new Date(profileData.user.createdAt).toLocaleDateString()}
            </p>
          </Card.Body>
        </Card>

        {/* Stats Cards */}
        <Row className="mb-4">
          {user?.role === 'instructor' ? (
            // Instructor Stats
            <>
              <Col md={3} className="mb-3">
                <Card className="stat-card text-center">
                  <Card.Body>
                    <FaBook className="stat-icon text-primary mb-2" size={30} />
                    <h4 className="stat-number">{profileData.stats.totalCourses}</h4>
                    <p className="stat-label">Total Courses</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="stat-card text-center">
                  <Card.Body>
                    <FaUsers className="stat-icon text-success mb-2" size={30} />
                    <h4 className="stat-number">{profileData.stats.totalStudents}</h4>
                    <p className="stat-label">Total Students</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="stat-card text-center">
                  <Card.Body>
                    <FaStar className="stat-icon text-warning mb-2" size={30} />
                    <h4 className="stat-number">{profileData.stats.averageRating}</h4>
                    <p className="stat-label">Avg Rating</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="stat-card text-center">
                  <Card.Body>
                    <FaDollarSign className="stat-icon text-success mb-2" size={30} />
                    <h4 className="stat-number">${profileData.stats.totalRevenue}</h4>
                    <p className="stat-label">Total Revenue</p>
                  </Card.Body>
                </Card>
              </Col>
            </>
          ) : (
            // Student Stats
            <Col md={4} className="mx-auto mb-3">
              <Card className="stat-card text-center">
                <Card.Body>
                  <FaGraduationCap className="stat-icon text-primary mb-2" size={30} />
                  <h4 className="stat-number">{profileData.stats.coursesEnrolled}</h4>
                  <p className="stat-label">Courses Enrolled</p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Content Section */}
        {user?.role === 'instructor' ? (
          // Instructor Content
          <Row>
            <Col lg={8}>
              {/* Created Courses */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaBook className="me-2" />
                    My Created Courses
                  </h5>
                </Card.Header>
                <Card.Body>
                  {profileData.courses && profileData.courses.length > 0 ? (
                    <div className="courses-list">
                      {profileData.courses.map((course) => (
                        <div key={course._id} className="course-item mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="course-title mb-1">{course.title || 'Untitled Course'}</h6>
                              <p className="course-description text-muted mb-2">
                                {course.description ? `${course.description.substring(0, 100)}...` : 'No description available'}
                              </p>
                              <div className="course-meta">
                                <Badge bg="secondary" className="me-2">{course.category || 'General'}</Badge>
                                <Badge bg="info" className="me-2">{course.level || 'Beginner'}</Badge>
                                <Badge bg="success" className="me-2">${course.price || 0}</Badge>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="course-stats">
                                <small className="text-muted d-block">
                                  <FaUsers className="me-1" />
                                  {course.totalStudents || 0} students
                                </small>
                                <small className="text-muted d-block">
                                  <FaStar className="me-1" />
                                  {course.averageRating || 0} rating
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center">No courses created yet.</p>
                  )}
                </Card.Body>
              </Card>

              {/* Course Reviews */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <FaStar className="me-2" />
                    Course Reviews
                  </h5>
                </Card.Header>
                <Card.Body>
                  {profileData.courses && profileData.courses.some(course => course.reviews && course.reviews.length > 0) ? (
                    <div className="reviews-list">
                      {profileData.courses.map((course) => 
                        course.reviews && course.reviews.map((review) => (
                          <div key={review._id} className="review-item mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="course-name mb-1">{course.title || 'Untitled Course'}</h6>
                                <div className="rating mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                      key={i} 
                                      className={i < review.rating ? 'text-warning' : 'text-muted'} 
                                      size={16}
                                    />
                                  ))}
                                </div>
                                <p className="review-comment mb-1">{review.comment || 'No comment'}</p>
                                <small className="text-muted">- {review.user?.name || 'Anonymous'}</small>
                              </div>
                              <small className="text-muted">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                              </small>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-muted text-center">No reviews yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Performance Chart */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">
                    <FaChartLine className="me-2" />
                    Performance Overview
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="performance-item mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Course Completion Rate</span>
                      <span>85%</span>
                    </div>
                    <ProgressBar now={85} variant="success" />
                  </div>
                  <div className="performance-item mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Student Satisfaction</span>
                      <span>{profileData.stats.averageRating}/5</span>
                    </div>
                    <ProgressBar 
                      now={(profileData.stats.averageRating / 5) * 100} 
                      variant="warning" 
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          // Student Content
          <Row>
            <Col lg={8}>
              {/* Enrolled Courses */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <FaGraduationCap className="me-2" />
                    My Enrolled Courses
                  </h5>
                </Card.Header>
                <Card.Body>
                  {profileData.purchasedCourses && profileData.purchasedCourses.length > 0 ? (
                    <div className="courses-list">
                      {profileData.purchasedCourses.map((course) => (
                        <div key={course._id} className="course-item mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="course-title mb-1">{course.title || 'Untitled Course'}</h6>
                              <p className="course-description text-muted mb-2">
                                {course.description ? `${course.description.substring(0, 100)}...` : 'No description available'}
                              </p>
                              <div className="course-meta">
                                <Badge bg="secondary" className="me-2">{course.category || 'General'}</Badge>
                                <Badge bg="success" className="me-2">${course.price || 0}</Badge>
                              </div>
                            </div>
                            <div className="text-end">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleContinueLearning(course._id)}
                              >
                                Continue Learning
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FaGraduationCap size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">No courses enrolled yet</h5>
                      <p className="text-muted">Start your learning journey by enrolling in courses!</p>
                      <Button variant="primary" href="/courses">
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Learning Progress */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <FaChartLine className="me-2" />
                    Learning Progress
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="progress-item mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Courses Completed</span>
                      <span>0/{profileData.stats.coursesEnrolled}</span>
                    </div>
                    <ProgressBar now={0} variant="info" />
                  </div>
                  <div className="progress-item mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Learning Streak</span>
                      <span>0 days</span>
                    </div>
                    <ProgressBar now={0} variant="success" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Profile;
