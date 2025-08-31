import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <Spinner animation="border" variant="primary" size={size} />
        <p className="mt-3 text-muted">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;