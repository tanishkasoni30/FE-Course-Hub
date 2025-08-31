import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="rating-stars">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="rating-stars">
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-muted">
          ☆
        </span>
      );
    }

    return stars;
  };



  // Generate a gradient background based on category
  const getCourseGradient = (category) => {
    const gradientMap = {
      'Programming': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Design': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Business': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Marketing': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Music': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Photography': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'Health': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'Fitness': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'Language': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'General': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return gradientMap[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <Card 
      className={`course-card h-100 ${isHovered ? 'card-hovered' : ''}`}
      data-category={course.category || 'General'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="course-image-container">
        <div 
          className="course-image book-background"
          style={{ 
            background: getCourseGradient(course.category || 'General')
          }}
        >
          {/* Enhanced overlay with smooth animation */}
          <div className={`course-overlay ${isHovered ? 'overlay-visible' : ''}`}>
            <div className="overlay-content">
              <span className="overlay-icon">📚</span>
              <span className="overlay-text">View Course</span>
            </div>
          </div>
          
          {/* Floating price badge */}
          <div className="floating-price">
            ₹{course.price}
          </div>
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column">
        {/* Enhanced instructor and level badges */}
        <div className="badge-container mb-3">
          <Badge bg="info" className="instructor-badge">
            <span className="badge-icon">👨‍🏫</span>
            {course.instructor?.name || "Unknown Instructor"}
          </Badge>
          <Badge bg="secondary" className="level-badge">
            <span className="badge-icon">📊</span>
            {course.level || "Beginner"}
          </Badge>
        </div>

        {/* Enhanced course title with hover effect */}
        <Card.Title className="h5 course-title mb-3">
          {course.title}
        </Card.Title>
        
        {/* Enhanced description */}
        <Card.Text className="text-muted flex-grow-1 course-description mb-3">
          {course.description?.substring(0, 100)}...
        </Card.Text>

        {/* Enhanced rating and stats section */}
        <div className="course-stats mb-3">
          <div className="rating-section mb-2">
            <div className="rating-container">
              {renderStars(course.averageRating || 0)}
            </div>
            <span className="rating-text">
              ({course.reviews?.length || 0} reviews)
            </span>
          </div>
          <div className="enrollment-info">
            <span className="enrollment-icon">👥</span>
            <span className="enrollment-text">
              {course.totalStudents || 0} students enrolled
            </span>
          </div>
        </div>

        {/* Enhanced action section */}
        <div className="action-section">
          <Button
            variant="primary"
            className="view-details-btn"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            <span className="btn-icon">📖</span>
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
