import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

const CourseSkeleton = () => {
  return (
    <Card className="course-card skeleton-card">
      <div className="skeleton-image-container">
        <Placeholder as="div" animation="glow" className="skeleton-image" />
      </div>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={4} />
        </Placeholder>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Placeholder.Button variant="primary" xs={4} />
          <Placeholder as="span" animation="glow">
            <Placeholder xs={3} />
          </Placeholder>
        </div>
      </Card.Body>
    </Card>
  );
};

const CourseSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="row">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-md-6 col-lg-4 mb-4">
          <CourseSkeleton />
        </div>
      ))}
    </div>
  );
};

export default CourseSkeleton;
export { CourseSkeletonGrid };
