import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!res.ok) throw new Error('Course not found');
        const data = await res.json();
        setCourse(data);
        
        // Check if user is already enrolled (you can modify this logic)
        const enrollmentStatus = localStorage.getItem(`enrolled_${id}`);
        setIsEnrolled(enrollmentStatus === 'true');
      } catch (err) {
        setError("Could not load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      // Simulate enrollment API call
      const response = await fetch(`http://localhost:5000/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
        }
      });
      
      if (response.ok) {
        setIsEnrolled(true);
        localStorage.setItem(`enrolled_${id}`, 'true');
        alert('Successfully enrolled in the course!');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Error enrolling in course. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading course details...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={() => navigate('/courses')} className="back-btn">
        Back to Courses
      </button>
    </div>
  );
  
  if (!course) return (
    <div className="error-container">
      <p className="error-message">Course not found</p>
      <button onClick={() => navigate('/courses')} className="back-btn">
        Back to Courses
      </button>
    </div>
  );

  return (
    <div className="course-detail-page">
      <style jsx>{`
        .course-detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #dc3545;
          font-size: 18px;
          margin-bottom: 20px;
        }

        .back-btn {
          background: none;
          border: none;
          color: #007bff;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 20px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #f8f9fa;
          color: #0056b3;
        }

        .course-hero {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          color: white;
          margin-bottom: 40px;
        }

        .course-hero-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .category-tag {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          width: fit-content;
          backdrop-filter: blur(10px);
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .course-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
        }

        .course-stats {
          display: flex;
          gap: 30px;
          margin-top: 20px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .course-enrollment {
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
          height: fit-content;
          backdrop-filter: blur(10px);
        }

        .price-section {
          margin-bottom: 20px;
        }

        .current-price {
          font-size: 2.5rem;
          font-weight: 700;
          color: #28a745;
          margin: 0;
        }

        .original-price {
          font-size: 1.2rem;
          color: #6c757d;
          text-decoration: line-through;
          margin-left: 10px;
        }

        .discount-badge {
          background: #dc3545;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
          display: inline-block;
        }

        .enroll-btn {
          background: ${isEnrolled ? '#28a745' : '#007bff'};
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .enroll-btn:hover {
          background: ${isEnrolled ? '#218838' : '#0056b3'};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .enroll-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .enrollment-benefits {
          text-align: left;
          color: #495057;
        }

        .enrollment-benefits p {
          margin: 8px 0;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .benefit-icon {
          color: #28a745;
          font-weight: bold;
        }

        .course-content-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .course-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 20px 30px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          color: #6c757d;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-btn:hover {
          color: #007bff;
          background: rgba(0, 123, 255, 0.05);
        }

        .tab-btn.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background: white;
        }

        .tab-content {
          padding: 40px;
        }

        .overview-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .main-content h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.8rem;
        }

        .main-content h3 {
          color: #2c3e50;
          margin: 30px 0 15px 0;
          font-size: 1.4rem;
        }

        .course-description-full {
          font-size: 16px;
          line-height: 1.6;
          color: #495057;
          margin-bottom: 30px;
        }

        .course-description-full p {
          margin-bottom: 15px;
        }

        .learning-outcomes {
          margin-bottom: 30px;
        }

        .outcomes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
        }

        .outcome-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          border-left: 4px solid #28a745;
          transition: transform 0.2s ease;
        }

        .outcome-item:hover {
          transform: translateX(5px);
        }

        .outcome-icon {
          color: #28a745;
          font-weight: bold;
          font-size: 18px;
        }

        .outcome-text {
          color: #495057;
          font-size: 15px;
          line-height: 1.4;
        }

        .prerequisites-section {
          margin-bottom: 30px;
        }

        .prerequisites-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .prerequisites-list li {
          padding: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          margin-bottom: 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .course-info-card,
        .course-features-card {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .course-info-card h3,
        .course-features-card h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.2rem;
        }

        .info-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .info-label {
          font-weight: 600;
          color: #6c757d;
          font-size: 14px;
        }

        .info-value {
          color: #2c3e50;
          font-size: 16px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #495057;
          padding: 10px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .feature-item:hover {
          background: rgba(0, 123, 255, 0.05);
        }

        .feature-icon {
          font-size: 18px;
          color: #007bff;
        }

        .star {
          color: #ffc107;
          font-size: 1.2rem;
        }

        .star.empty {
          color: #dee2e6;
        }

        .star.half {
          background: linear-gradient(90deg, #ffc107 50%, #dee2e6 50%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .curriculum-section,
        .instructor-section,
        .reviews-section {
          max-width: 800px;
        }

        .curriculum-section h2,
        .instructor-section h2,
        .reviews-section h2 {
          color: #2c3e50;
          margin-bottom: 30px;
          font-size: 1.8rem;
        }

        .curriculum-placeholder,
        .reviews-placeholder {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 8px;
          color: #6c757d;
          text-align: center;
        }

        .instructor-card {
          display: flex;
          gap: 20px;
          background: #f8f9fa;
          padding: 30px;
          border-radius: 12px;
          align-items: center;
        }

        .instructor-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .instructor-details h3 {
          margin: 0 0 5px 0;
          color: #2c3e50;
        }

        .instructor-title {
          color: #007bff;
          font-weight: 500;
          margin: 0 0 15px 0;
        }

        .instructor-bio {
          color: #6c757d;
          line-height: 1.6;
          margin: 0;
        }

        .reviews-summary {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .rating-score {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .score {
          font-size: 3rem;
          font-weight: bold;
          color: #ffc107;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        @media (max-width: 768px) {
          .course-hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .course-title {
            font-size: 2rem;
          }
          
          .course-stats {
            justify-content: center;
          }
          
          .overview-section {
            grid-template-columns: 1fr;
          }
          
          .course-tabs {
            flex-wrap: wrap;
          }
          
          .tab-btn {
            flex: 1;
            min-width: 120px;
          }
          
          .instructor-card {
            flex-direction: column;
            text-align: center;
          }
          
          .rating-summary {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="course-header">
        <button className="back-btn" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
        <div className="course-hero">
          <div className="course-hero-content">
            <div className="course-category">
              {course.category && <span className="category-tag">{course.category}</span>}
            </div>
            <h1 className="course-title">{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>
            
            {/* Course Stats */}
            <div className="course-stats">
              {course.rating && (
                <div className="stat-item">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-value">{course.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
              )}
              {course.enrollmentCount && (
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-value">{course.enrollmentCount}</span>
                  <span className="stat-label">Students</span>
                </div>
              )}
              {course.duration && (
                <div className="stat-item">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-value">{course.duration}</span>
                  <span className="stat-label">Duration</span>
                </div>
              )}
              {course.level && (
                <div className="stat-item">
                  <span className="stat-icon">📊</span>
                  <span className="stat-value">{course.level}</span>
                  <span className="stat-label">Level</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Price and Enroll Section */}
          <div className="course-enrollment">
            <div className="price-section">
              <div className="current-price">{formatPrice(course.price)}</div>
              {course.originalPrice && course.originalPrice > course.price && (
                <>
                  <div className="original-price">{formatPrice(course.originalPrice)}</div>
                  <div className="discount-badge">
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                  </div>
                </>
              )}
            </div>
            <button 
              className="enroll-btn" 
              onClick={handleEnroll}
              disabled={isEnrolled}
            >
              {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
            </button>
            <div className="enrollment-benefits">
              <p><span className="benefit-icon">✓</span> Lifetime access</p>
              <p><span className="benefit-icon">✓</span> Certificate of completion</p>
              <p><span className="benefit-icon">✓</span> 30-day money-back guarantee</p>
              <p><span className="benefit-icon">✓</span> Mobile & desktop access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content-wrapper">
        {/* Navigation Tabs */}
        <div className="course-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
            onClick={() => setActiveTab('curriculum')}
          >
            Curriculum
          </button>
          <button 
            className={`tab-btn ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructor')}
          >
            Instructor
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="main-content">
                <h2>Course Description</h2>
                <div className="course-description-full">
                  {course.content ? (
                    <div dangerouslySetInnerHTML={{ __html: course.content }} />
                  ) : (
                    <p>This comprehensive course will guide you through all the essential concepts and practical skills needed to master the subject. Join thousands of students who have already transformed their careers with this course.</p>
                  )}
                </div>

                {/* What You'll Learn */}
                {course.topics && course.topics.length > 0 && (
                  <div className="learning-outcomes">
                    <h3>What You'll Learn</h3>
                    <div className="outcomes-grid">
                      {course.topics.map((topic, index) => (
                        <div key={index} className="outcome-item">
                          <span className="outcome-icon">✓</span>
                          <span className="outcome-text">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="prerequisites-section">
                    <h3>Prerequisites</h3>
                    <ul className="prerequisites-list">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index}>
                          <span>⚠️</span>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="sidebar-content">
                <div className="course-info-card">
                  <h3>Course Information</h3>
                  <div className="info-items">
                    {course.instructor && (
                      <div className="info-item">
                        <span className="info-label">Instructor:</span>
                        <span className="info-value">{course.instructor}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="info-item">
                        <span className="info-label">Duration:</span>
                        <span className="info-value">{course.duration}</span>
                      </div>
                    )}
                    {course.level && (
                      <div className="info-item">
                        <span className="info-label">Level:</span>
                        <span className="info-value">{course.level}</span>
                      </div>
                    )}
                    {course.language && (
                      <div className="info-item">
                        <span className="info-label">Language:</span>
                        <span className="info-value">{course.language}</span>
                      </div>
                    )}
                    {course.lastUpdated && (
                      <div className="info-item">
                        <span className="info-label">Last Updated:</span>
                        <span className="info-value">{new Date(course.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Features */}
                <div className="course-features-card">
                  <h3>This Course Includes</h3>
                  <div className="features-list">
                    <div className="feature-item">
                      <span className="feature-icon">📹</span>
                      <span>HD Video lectures</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📝</span>
                      <span>Assignments & exercises</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📱</span>
                      <span>Mobile & desktop access</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🏆</span>
                      <span>Certificate of completion</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">💬</span>
                      <span>Q&A support</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📚</span>
                      <span>Downloadable resources</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="curriculum-section">
              <h2>Course Curriculum</h2>
              <div className="curriculum-placeholder">
                <h3>Coming Soon!</h3>
                <p>Detailed curriculum will be displayed here, including:</p>
                <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '20px auto' }}>
                  <li>Module breakdown with learning objectives</li>
                  <li>Lesson titles and estimated durations</li>
                  <li>Hands-on projects and assignments</li>
                  <li>Downloadable resources and materials</li>
                  <li>Progress tracking and milestones</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="instructor-section">
              <h2>Meet Your Instructor</h2>
              <div className="instructor-info">
                {course.instructor ? (
                  <div className="instructor-card">
                    <div className="instructor-avatar">
                      <span className="avatar-placeholder">
                        {course.instructor.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="instructor-details">
                      <h3>{course.instructor}</h3>
                      <p className="instructor-title">Expert Instructor & Industry Professional</p>
                      <p className="instructor-bio">
                        A seasoned professional with extensive experience in the field. 
                        Passionate about sharing knowledge and helping students achieve their goals 
                        through practical, real-world applications and industry best practices.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="curriculum-placeholder">
                    <p>Instructor information will be available soon.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <h2>Student Reviews</h2>
              <div className="reviews-summary">
                {course.rating && (
                  <div className="rating-summary">
                    <div className="rating-score">
                      <span className="score">{course.rating}</span>
                      <div className="stars">
                        {renderStars(course.rating)}
                      </div>
                    </div>
                    <div>
                      <p>Based on {course.enrollmentCount || 0} student reviews</p>
                      <p>Join thousands of satisfied learners!</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="reviews-placeholder">
                <h3>Reviews Coming Soon!</h3>
                <p>Student reviews and testimonials will appear here once the course goes live.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;