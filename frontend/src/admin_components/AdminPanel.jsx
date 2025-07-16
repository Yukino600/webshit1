// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css'; // ✅ New


const AdminPanel = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0
  });

  // Add/Edit Course Form State
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: 'beginner',
    category: '',
    instructor: '',
    requirements: '',
    whatYouWillLearn: ''
  });

  // Confirmation dialog state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Fetch courses and stats
  useEffect(() => {
    if (user && user.isAdmin) {
      fetchCourses();
      fetchStats();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value
    });
  };

  // Reset form
  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      price: '',
      duration: '',
      level: 'beginner',
      category: '',
      instructor: '',
      requirements: '',
      whatYouWillLearn: ''
    });
  };

  // Add new course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });

      const data = await res.json();

      if (res.ok) {
        setCourses([...courses, data]);
        resetForm();
        setShowAddCourse(false);
        alert('Course added successfully!');
        fetchStats(); // Update stats
      } else {
        alert(data.message || 'Failed to add course');
      }
    } catch (err) {
      console.error('Error adding course:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit course
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration,
      level: course.level,
      category: course.category || '',
      instructor: course.instructor || '',
      requirements: course.requirements || '',
      whatYouWillLearn: course.whatYouWillLearn || ''
    });
    setShowEditCourse(true);
  };

  // Update course
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:5000/api/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? data : course
        ));
        resetForm();
        setShowEditCourse(false);
        setEditingCourse(null);
        alert('Course updated successfully!');
      } else {
        alert(data.message || 'Failed to update course');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete course
  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:5000/api/courses/${courseToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setCourses(courses.filter(course => course._id !== courseToDelete));
        alert('Course deleted successfully!');
        fetchStats(); // Update stats
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Network error. Please try again.');
    }

    setShowConfirmDelete(false);
    setCourseToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setCourseToDelete(null);
  };

  // Close modals
  const closeAddModal = () => {
    setShowAddCourse(false);
    resetForm();
  };

  const closeEditModal = () => {
    setShowEditCourse(false);
    setEditingCourse(null);
    resetForm();
  };

  if (!user || !user.isAdmin) {
    return <div className="unauthorized">Unauthorized access</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Welcome, {user.name || user.username}!</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <p className="stat-number">{stats.totalEnrollments}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Manage Courses
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {/* Course Management Tab */}
      {activeTab === 'courses' && (
        <div className="courses-section">
          <div className="section-header">
            <h2>Course Management</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddCourse(true)}
            >
              + Add New Course
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : error ? (
            <div className="error">❌ {error}</div>
          ) : (
            <div className="courses-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id}>
                      <td>{course.title}</td>
                      <td>${course.price}</td>
                      <td>{course.duration}h</td>
                      <td>{course.level}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEditCourse(course)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Add New Course</h3>
              <button className="close-btn" onClick={closeAddModal}>×</button>
            </div>
            <form onSubmit={handleAddCourse} className="course-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Course Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={courseForm.title}
                    onChange={handleFormChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={courseForm.category}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={courseForm.description}
                  onChange={handleFormChange}
                  required
                  disabled={isSubmitting}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={courseForm.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="duration">Duration (hours) *</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleFormChange}
                    required
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="level">Level *</label>
                  <select
                    id="level"
                    name="level"
                    value={courseForm.level}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="instructor">Instructor</label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={courseForm.instructor}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="requirements">Requirements</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={courseForm.requirements}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  rows="3"
                  placeholder="List the prerequisites for this course..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="whatYouWillLearn">What You Will Learn</label>
                <textarea
                  id="whatYouWillLearn"
                  name="whatYouWillLearn"
                  value={courseForm.whatYouWillLearn}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  rows="3"
                  placeholder="Describe what students will learn in this course..."
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeAddModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourse && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Edit Course</h3>
              <button className="close-btn" onClick={closeEditModal}>×</button>
            </div>
            <form onSubmit={handleUpdateCourse} className="course-form">
              {/* Same form fields as Add Course */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-title">Course Title *</label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    value={courseForm.title}
                    onChange={handleFormChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-category">Category</label>
                  <input
                    type="text"
                    id="edit-category"
                    name="category"
                    value={courseForm.category}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description *</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={courseForm.description}
                  onChange={handleFormChange}
                  required
                  disabled={isSubmitting}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-price">Price ($) *</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={courseForm.price}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-duration">Duration (hours) *</label>
                  <input
                    type="number"
                    id="edit-duration"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleFormChange}
                    required
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-level">Level *</label>
                  <select
                    id="edit-level"
                    name="level"
                    value={courseForm.level}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-buttons">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this course?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmDeleteCourse}
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;