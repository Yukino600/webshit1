import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = ({ user }) => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch("http://localhost:5000/api/courses", { headers });
      const data = await res.json();

      if (res.ok) {
        setFeaturedCourses(data.slice(0, 3));
      } else {
        setError(data.message || "Failed to load courses");
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (courseId) => {
    if (user) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate("/login");
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleAddToFavorites = (courseId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isAlreadyFavorite = favorites.includes(courseId);
    if (isAlreadyFavorite) {
      setFavorites(favorites.filter((id) => id !== courseId));
      alert("Removed from favorites!");
    } else {
      setFavorites([...favorites, courseId]);
      alert("Added to favorites!");
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to EduElite</h1>
          <p className="hero-subtitle">
            {user
              ? `Hello, ${user.username || user.name || user.email}! Continue your learning journey with our premium courses.`
              : "Transform your career with our world-class online courses. Learn from industry experts and advance your skills."}
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/courses")}>
              Browse Courses
            </button>
            {!user && (
              <button className="btn btn-secondary" onClick={() => navigate("/login")}>
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Guest Section */}
      {!user && (
        <section className="guest-section">
          <div className="guest-content">
            <h2>Start Your Journey</h2>
            <p>Join thousands of learners who are advancing their careers with EduElite.</p>
            <div className="guest-actions">
              <button className="btn btn-primary" onClick={() => navigate("/register")}>
                🚀 Join EduElite
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose EduElite?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals and certified educators with years of experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Flexible Learning</h3>
            <p>Study at your own pace with 24/7 access to course materials and resources.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Certificates</h3>
            <p>Earn recognized certificates upon completion to boost your professional profile.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Community Support</h3>
            <p>Join a vibrant community of learners and get help when you need it.</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses-section">
        <div className="section-header">
          <h2>Featured Courses</h2>
          <button className="btn view-all-btn" onClick={() => navigate("/courses")}>
            View All Courses
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Loading featured courses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="error">
            <p>❌ {error}</p>
            <button className="btn btn-primary" onClick={fetchFeaturedCourses}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="course-grid">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <div key={course._id} className="course-card">
                  <div
                    className="course-content"
                    onClick={() => handleCourseClick(course._id)}
                  >
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span className="course-level">{course.level}</span>
                      <span className="course-duration">{course.duration} hours</span>
                    </div>
                  </div>
                  <div className="course-footer">
                    <strong className="course-price">${course.price}</strong>
                    <div className="course-actions">
                      {user ? (
                        <button
                          className="btn enroll-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollClick(course._id);
                          }}
                        >
                          Enroll Now
                        </button>
                      ) : (
                        <button
                          className="btn login-required-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/login");
                          }}
                        >
                          Login to Enroll
                        </button>
                      )}
                      <button
                        className={`favorite-btn ${favorites.includes(course._id) ? "favorited" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(course._id);
                        }}
                        title={
                          favorites.includes(course._id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {favorites.includes(course._id) ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <div className="no-courses-icon">📚</div>
                <p>No featured courses available at the moment.</p>
                <p>Check back later for new courses!</p>
                <button className="btn btn-primary" onClick={() => navigate("/courses")}>
                  Browse All Courses
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>
            Join thousands of students who are already advancing their careers with EduElite.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/courses")}>
              Explore Courses
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="social-links">
            <a href="https://github.com/EnderZip" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://facebook.com/EnderZip" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/EnderZip" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com/in/EnderZip" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>

          <p className="license-text">
            © 2025 EduElite. All rights reserved. Licensed under MIT.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;