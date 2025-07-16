import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyCourses.css';

const MyCourses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("userToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch("http://localhost:5000/api/enrollments/my-courses", {
          headers
        });

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          setError(data.error || data.message || "Failed to load courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  const getStats = () => {
    const total = courses.length;
    const completed = courses.filter(c => c.status === 'completed').length;
    const inProgress = courses.filter(c => c.status === 'in-progress').length;
    const notStarted = courses.filter(c => c.status === 'not-started').length;
    
    return { total, completed, inProgress, notStarted };
  };

  const stats = getStats();

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  const getContinueButtonText = (status, progress) => {
    if (status === 'completed') return 'Review';
    if (status === 'not-started') return 'Start Course';
    return 'Continue';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="mycourses-container">
        <div className="error-state">
          <div className="error-icon">🔒</div>
          <h3>Access Denied</h3>
          <p>Please log in to view your courses.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mycourses-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mycourses-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mycourses-container">
      <div className="mycourses-header">
        <h1>My Learning Journey</h1>
        <p>Track your progress and continue learning</p>
      </div>

      <div className="mycourses-content">
        {/* Statistics Cards */}
        <div className="courses-stats">
          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Courses</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📖</span>
            <div className="stat-number">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div className="stat-number">{stats.notStarted}</div>
            <div className="stat-label">Not Started</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="courses-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`filter-btn ${filter === 'not-started' ? 'active' : ''}`}
            onClick={() => setFilter('not-started')}
          >
            Not Started
          </button>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No courses found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't enrolled in any courses yet. Start your learning journey today!"
                : `No ${filter.replace('-', ' ')} courses found. Try a different filter.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/courses" className="empty-action">
                <span>🔍</span>
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className={`course-status status-${course.status}`}>
                  {getStatusText(course.status)}
                </div>
                
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="course-image"
                />
                
                <div className="course-content">
                  <div className="course-category">{course.category}</div>
                  
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                  
                  <div className="course-progress">
                    <div className="progress-header">
                      <span className="progress-label">Progress</span>
                      <span className="progress-percentage">{course.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="course-meta">
                    <div className="course-duration">
                      <span>⏱️</span>
                      {course.duration}
                    </div>
                    <div className="course-level">{course.level}</div>
                  </div>
                  
                  <div className="course-dates">
                    <small>Enrolled: {formatDate(course.enrolledDate)}</small>
                    <small>Last accessed: {formatDate(course.lastAccessed)}</small>
                  </div>
                  
                  <div className="course-actions">
                    <Link 
                      to={`/course/${course.id}`} 
                      className="btn btn-primary"
                    >
                      <span>▶️</span>
                      {getContinueButtonText(course.status, course.progress)}
                    </Link>
                    <button className="btn btn-secondary">
                      <span>💬</span>
                      Discuss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;