import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { coursesAPI } from '../../services/api';
import CourseCard from '../../components/Course/CourseCard';
import CourseFilters from '../../components/Course/CourseFilters';
import { CourseSkeletonGrid } from '../../components/UI/CourseSkeleton';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    minPrice: '',
    maxPrice: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchCourses();
  }, [filters, pagination.currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 9
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await coursesAPI.getAll(params);
      const data = response.data;

      setCourses(data.courses || data);
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        total: data.total || (data.courses ? data.courses.length : data.length)
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo(0, 0);
  };

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold text-center mb-3">All Courses</h1>
          <p className="lead text-center text-muted">
            {loading ? 'Loading amazing courses...' : `Discover ${pagination.total} amazing courses from expert instructors`}
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={3} className="mb-4">
          <CourseFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </Col>

        <Col lg={9}>
          {loading ? (
            <CourseSkeletonGrid count={9} />
          ) : courses.length === 0 ? (
            <div className="text-center py-5">
              <h3>No courses found</h3>
              <p className="text-muted">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              <Row>
                {courses.map((course) => (
                  <Col lg={4} md={6} className="mb-4" key={course._id}>
                    <CourseCard course={course} />
                  </Col>
                ))}
              </Row>

              {pagination.totalPages > 1 && (
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <Pagination>
                      <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                      />
                      
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 1)
                        ) {
                          return (
                            <Pagination.Item
                              key={page}
                              active={page === pagination.currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Pagination.Item>
                          );
                        }
                        return null;
                      })}
                      
                      <Pagination.Next
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                      />
                      <Pagination.Last
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.currentPage === pagination.totalPages}
                      />
                    </Pagination>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CourseList;