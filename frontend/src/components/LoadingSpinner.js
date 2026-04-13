import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-overlay" id="loading-spinner">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{
          marginTop: '16px',
          color: 'var(--gray-500)',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
