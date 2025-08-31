import React from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const CourseFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Card className="sidebar">
      <Card.Header>
        <h5 className="mb-0">🔍 Filter Courses</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              placeholder="Search courses..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={filters.category || ''}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
              <option value="Photography">Photography</option>
              <option value="Music">Music</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Level</Form.Label>
            <Form.Select
              name="level"
              value={filters.level || ''}
              onChange={handleInputChange}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </Form.Select>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={filters.minPrice || ''}
                  onChange={handleInputChange}
                  placeholder="₹0"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice || ''}
                  onChange={handleInputChange}
                  placeholder="₹10000"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button 
            variant="outline-secondary" 
            onClick={onClearFilters}
            className="w-100"
          >
            Clear Filters
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CourseFilters;