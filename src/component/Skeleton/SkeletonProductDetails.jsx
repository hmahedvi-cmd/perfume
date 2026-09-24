import React from 'react';
import './Skeleton.css';

const SkeletonProductDetails = () => {
  return (
    <div className="details-container container skeleton-details">
      <div className="details-left">
        <div className="skeleton skeleton-img-large"></div>
        <div className="gallery-thumbnails">
          <div className="skeleton skeleton-thumb"></div>
          <div className="skeleton skeleton-thumb"></div>
          <div className="skeleton skeleton-thumb"></div>
        </div>
      </div>
      <div className="details-right">
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '15px', marginBottom: '15px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80%', height: '40px', marginBottom: '20px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '20%', height: '20px', marginBottom: '30px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '35px', marginBottom: '30px' }}></div>
        
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '15px', marginBottom: '10px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '95%', height: '15px', marginBottom: '10px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '85%', height: '15px', marginBottom: '40px' }}></div>
        
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '60px', marginBottom: '20px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '45px', marginBottom: '30px' }}></div>
      </div>
    </div>
  );
};

export default SkeletonProductDetails;
