import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursesAPI } from '../../services/api';
import { toast } from 'react-toastify';

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'General',
    level: 'Beginner',
    youtubeVideoUrl: '',
    notes: ''
  });
  
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('File size should be less than 10MB');
        return;
      }
      setPdfFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.youtubeVideoUrl.trim()) {
      newErrors.youtubeVideoUrl = 'YouTube video URL is required';
    } else if (!isValidYouTubeUrl(formData.youtubeVideoUrl)) {
      newErrors.youtubeVideoUrl = 'Please enter a valid YouTube URL';
    }
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Course notes are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('instructor', user._id);
      submitData.append('category', formData.category);
      submitData.append('level', formData.level);
      submitData.append('youtubeVideoUrl', formData.youtubeVideoUrl);
      submitData.append('notes', formData.notes);
      
      if (pdfFile) {
        submitData.append('pdfFile', pdfFile);
        console.log('PDF file attached:', pdfFile.name, pdfFile.size, pdfFile.type);
      } else {
        console.log('No PDF file selected');
      }

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.size, value.type);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await coursesAPI.create(submitData);
      
      toast.success('Course created successfully!');
      navigate(`/courses/${response.data._id}`);
      
    } catch (error) {
      console.error('Error creating course:', error);
      const message = error.response?.data?.message || 'Failed to create course';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return (
      <Container className="py-5" style={{ marginTop: '80px' }}>
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>Only instructors can create courses.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="dashboard-card">
            <Card.Header>
              <h3>Create New Course</h3>
              <p className="mb-0 text-muted">Share your knowledge with students</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter course title"
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        isInvalid={!!errors.price}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="General">General</option>
                        <option value="Programming">Programming</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Music">Music</option>
                        <option value="Photography">Photography</option>
                        <option value="Health">Health</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Language">Language</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Level</Form.Label>
                      <Form.Select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Course Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn in this course..."
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>YouTube Video URL *</Form.Label>
                  <Form.Control
                    type="url"
                    name="youtubeVideoUrl"
                    value={formData.youtubeVideoUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    isInvalid={!!errors.youtubeVideoUrl}
                  />
                  <Form.Text className="text-muted">
                    Paste the YouTube video URL that contains your course content
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.youtubeVideoUrl}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Course Notes *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add additional notes, learning objectives, or course outline..."
                    isInvalid={!!errors.notes}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notes}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Course Notes PDF (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Upload a PDF file with course materials, notes, or assignments (Max: 10MB)
                  </Form.Text>
                  {pdfFile && (
                    <div className="mt-2">
                      <small className="text-success">
                        ✓ Selected: {pdfFile.name}
                      </small>
                    </div>
                  )}
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
                        Creating Course...
                      </>
                    ) : (
                      'Create Course'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCourseForm;
