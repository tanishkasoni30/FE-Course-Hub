import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, ordersAPI, reviewsAPI } from '../services/api';
import CourseCard from '../components/Course/CourseCard';
import { CourseSkeletonGrid } from '../components/UI/CourseSkeleton';

const Home = () => {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured courses (first 6 courses)
      const coursesResponse = await coursesAPI.getAll({ limit: 6 });
      setFeaturedCourses(coursesResponse.data.courses || coursesResponse.data);

      // Fetch stats
      const [orderStats, reviewStats] = await Promise.all([
        ordersAPI.getStats(),
        reviewsAPI.getStats()
      ]);

      setStats({
        totalCourses: coursesResponse.data.total || featuredCourses.length,
        totalStudents: orderStats.data.totalOrders || 0,
        totalInstructors: 25, // Mock data
        totalReviews: reviewStats.data.totalReviews || 0
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="hero-content fade-in-up">
                <h1 className="hero-title mb-4">
                  Learn Without Limits
                </h1>
                <p className="hero-subtitle mb-5">
                  Discover thousands of courses from expert instructors. 
                  Start your learning journey today and unlock your potential.
                </p>
                <div className="hero-buttons">
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="hero-btn me-3 mb-2 hover-bounce"
                    onClick={() => navigate('/courses')}
                  >
                    🚀 Explore Courses
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg"
                    className="hero-btn mb-2 hover-pulse"
                    onClick={() => navigate('/register')}
                  >
                    ✨ Get Started
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        
        {/* Floating Elements
        <div className="floating-elements">
          <div className="floating-icon floating-icon-1">📚</div>
          <div className="floating-icon floating-icon-2">💻</div>
          <div className="floating-icon floating-icon-3">🎨</div>
          <div className="floating-icon floating-icon-4">📱</div>
        </div> */}
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses-section py-5">
        <Container>
          <Row className="mb-4">
            <Col className="text-center">
              <h2 className="section-title mb-3">Featured Courses</h2>
              <p className="section-subtitle">
                {loading ? 'Loading amazing courses...' : `Discover ${stats.totalCourses} amazing courses from expert instructors`}
              </p>
            </Col>
          </Row>
          
          <Row>
            {loading ? (
              <CourseSkeletonGrid count={6} />
            ) : (
              featuredCourses.map((course, index) => (
                <Col lg={4} md={6} className="mb-4" key={course._id}>
                  <div className="course-card-wrapper fade-in-up hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CourseCard course={course} />
                  </div>
                </Col>
              ))
            )}
          </Row>
          
          {!loading && (
            <Row className="mt-5">
              <Col className="text-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="cta-button hover-pulse"
                  onClick={() => navigate('/courses')}
                >
                  🎯 View All Courses
                </Button>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="section-title mb-3">Why Choose CourseHub?</h2>
              <p className="section-subtitle">
                We provide the best learning experience for students and instructors
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="mb-4">
              <div className="feature-card text-center h-100 fade-in-up hover-lift" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon mb-4 hover-tada">🎓</div>
                <h4 className="feature-title">Expert Instructors</h4>
                <p className="feature-description">
                  Learn from industry experts and experienced professionals 
                  who are passionate about teaching.
                </p>
              </div>
            </Col>
            
            <Col md={4} className="mb-4">
              <div className="feature-card text-center h-100 fade-in-up hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="feature-icon mb-4 hover-tada">📱</div>
                <h4 className="feature-title">Learn Anywhere</h4>
                <p className="feature-description">
                  Access your courses on any device, anywhere, anytime. 
                  Learn at your own pace and schedule.
                </p>
              </div>
            </Col>
            
            <Col md={4} className="mb-4">
              <div className="feature-card text-center h-100 fade-in-up hover-lift" style={{ animationDelay: '0.3s' }}>
                <div className="feature-icon mb-4 hover-tada">🏆</div>
                <h4 className="feature-title">Certificates</h4>
                <p className="feature-description">
                  Earn certificates upon course completion to showcase 
                  your new skills and knowledge.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="cta-content fade-in-up">
                <h2 className="cta-title mb-3">Ready to Start Learning?</h2>
                <p className="cta-subtitle mb-4">
                  Join thousands of students who are already learning and growing their skills.
                </p>
                <Button 
                  variant="light" 
                  size="lg"
                  className="cta-button-large hover-bounce"
                  onClick={() => navigate('/register')}
                >
                  🚀 Join Now - It's Free!
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;