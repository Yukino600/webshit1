// src/components/CoursesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./courselist.css";

const CoursesList = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        
        // Debug: Log the actual response structure
        console.log("API Response:", data);
        console.log("Type of data:", typeof data);
        console.log("Is array?", Array.isArray(data));
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else if (data && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          console.warn("Unexpected data format:", data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not fetch courses");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleCourseDetails = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (loading) return <p className="loading">Loading courses…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="courses-page">
      <header className="courses-header">
        <h1>All Courses</h1>
        <p>Explore our curated collection of learning paths.</p>
      </header>
      <section className="courses-section">
        <div className="course-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className={`course-card ${expandedCourse === course._id ? 'expanded' : ''}`}>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  {/* Expandable Details */}
                  {expandedCourse === course._id && (
                    <div className="course-details">
                      {/* Course Content Preview */}
                      {course.content && (
                        <div className="course-preview">
                          <h4>Course Overview:</h4>
                          <div 
                            className="course-content-preview"
                            dangerouslySetInnerHTML={{ 
                              __html: course.content.substring(0, 300) + (course.content.length > 300 ? '...' : '') 
                            }} 
                          />
                        </div>
                      )}
                      
                      {/* Additional Details */}
                      <div className="course-meta">
                        {course.instructor && (
                          <div className="meta-item">
                            <span className="meta-label">👨‍🏫 Instructor:</span>
                            <span className="meta-value">{course.instructor}</span>
                          </div>
                        )}
                        
                        {course.duration && (
                          <div className="meta-item">
                            <span className="meta-label">⏱️ Duration:</span>
                            <span className="meta-value">{course.duration}</span>
                          </div>
                        )}
                        
                        {course.level && (
                          <div className="meta-item">
                            <span className="meta-label">📊 Level:</span>
                            <span className="meta-value">{course.level}</span>
                          </div>
                        )}
                        
                        {course.category && (
                          <div className="meta-item">
                            <span className="meta-label">🏷️ Category:</span>
                            <span className="meta-value">{course.category}</span>
                          </div>
                        )}
                        
                        {course.enrollmentCount && (
                          <div className="meta-item">
                            <span className="meta-label">👥 Students:</span>
                            <span className="meta-value">{course.enrollmentCount} enrolled</span>
                          </div>
                        )}
                        
                        {course.rating && (
                          <div className="meta-item">
                            <span className="meta-label">⭐ Rating:</span>
                            <span className="meta-value">{course.rating}/5</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Topics/Skills */}
                      {course.topics && course.topics.length > 0 && (
                        <div className="course-topics">
                          <h4>What you'll learn:</h4>
                          <div className="topics-grid">
                            {course.topics.map((topic, index) => (
                              <span key={index} className="topic-tag">{topic}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Prerequisites */}
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="course-prerequisites">
                          <h4>Prerequisites:</h4>
                          <ul>
                            {course.prerequisites.map((prereq, index) => (
                              <li key={index}>{prereq}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="course-footer">
                  <div className="course-price-section">
                    <strong className="course-price">${course.price}</strong>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="original-price">${course.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="course-actions">
                    <button 
                      className="btn details-btn"
                      onClick={() => toggleCourseDetails(course._id)}
                    >
                      {expandedCourse === course._id ? '▲ Less Info' : '▼ More Info'}
                    </button>
                    <button 
                      className="btn enroll-btn"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      View Full Course
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CoursesList;