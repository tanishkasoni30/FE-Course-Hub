import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CourseStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndStudents();
  }, [id]);

  const fetchCourseAndStudents = async () => {
    try {
      setLoading(true);
      const [courseResponse, studentsResponse] = await Promise.all([
        coursesAPI.getById(id),
        coursesAPI.getBuyers(id)
      ]);
      
      setCourse(courseResponse.data);
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error('Error fetching course and students:', error);
      toast.error('Failed to load course and students data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading course students...</p>
        </div>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <Alert variant="danger">Course not found</Alert>
      </Container>
    );
  }

  // Check if user is the instructor of this course
  if (!user || !course.instructor || (course.instructor._id !== user._id && user.role !== 'admin')) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>Only the course instructor can view student information.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-2">Course Students</h2>
              <p className="text-muted mb-0">
                {course.title} - {students.length} enrolled students
              </p>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/courses/${id}`)}
            >
              ← Back to Course
            </button>
          </div>

          <Card className="dashboard-card">
            <Card.Header>
              <h4 className="mb-0">📊 Student Enrollment Overview</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={3}>
                  <div className="stats-card text-center">
                    <div className="stats-icon mb-2">👥</div>
                    <h3 className="stats-number">{students.length}</h3>
                    <p className="stats-label">Total Students</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stats-card text-center">
                    <div className="stats-icon mb-2">💰</div>
                    <h3 className="stats-number">
                      ₹{students.reduce((sum, student) => sum + student.amountPaid, 0)}
                    </h3>
                    <p className="stats-label">Total Revenue</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stats-card text-center">
                    <div className="stats-icon mb-2">⭐</div>
                    <h3 className="stats-number">{course.averageRating || 0}</h3>
                    <p className="stats-label">Average Rating</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="stats-card text-center">
                    <div className="stats-icon mb-2">📅</div>
                    <h3 className="stats-number">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </h3>
                    <p className="stats-label">Course Created</p>
                  </div>
                </Col>
              </Row>

              {students.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <h5>No students enrolled yet</h5>
                  <p className="mb-0">
                    When students purchase your course, they will appear here.
                  </p>
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table className="table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Purchase Date</th>
                        <th>Amount Paid</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student._id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{student.name}</strong>
                          </td>
                          <td>{student.email}</td>
                          <td>
                            {new Date(student.purchaseDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td>
                            <span className="price-tag">₹{student.amountPaid}</span>
                          </td>
                          <td>
                            <Badge bg="success">Enrolled</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseStudents;
