// src/admin_components/ManageCourses.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", price: 0, level: "", duration: 0 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("http://localhost:5000/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
      else setError(data.message || "Failed to load courses.");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`http://localhost:5000/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Course deleted successfully");
        fetchCourses();
      } else alert(data.message);
    } catch (err) {
      alert("Delete error");
    }
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("userToken");
      // 🔥 FIXED: Changed from /api/courses to /api/admin/courses
      const res = await fetch("http://localhost:5000/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Course added successfully");
        setShowAddModal(false);
        fetchCourses();
        resetForm();
      } else alert(data.message);
    } catch (err) {
      alert("Add error");
    }
  };

  const handleEdit = async () => {
  try {
    // Validate form data before sending
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please login again");
      return;
    }

    console.log("Sending update request for course:", currentCourse._id);
    console.log("Form data:", formData);

    const res = await fetch(`http://localhost:5000/api/admin/courses/${currentCourse._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price) || 0,
        level: formData.level || "Beginner",
        duration: Number(formData.duration) || 0,
      }),
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", res.headers);

    // Check if response is ok
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || `Server error: ${res.status}`;
      } catch {
        errorMessage = `Server error: ${res.status} - ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("Success response:", data);
    
    alert("Course updated successfully");
    setShowEditModal(false);
    fetchCourses();
    resetForm();
  } catch (err) {
    console.error("Edit error:", err);
    alert(`Edit error: ${err.message}`);
  }
};

  const resetForm = () => {
    setFormData({ title: "", description: "", price: 0, level: "", duration: 0 });
    setCurrentCourse(null);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      level: course.level,
      duration: course.duration,
    });
    setShowEditModal(true);
  };

  return (
    <div className="courses-section">
      <div className="section-header">
        <h2>📚 Manage Courses</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ➕ Add Course
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
                <th>Level</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>${c.price}</td>
                  <td>{c.level}</td>
                  <td>{c.duration} hrs</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEditModal(c)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{showEditModal ? "Edit Course" : "Add New Course"}</h3>
              <button className="close-btn" onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                &times;
              </button>
            </div>
            <div className="course-form">
              <div className="form-group">
                <label>Title</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <input value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Duration (hrs)</label>
                  <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                </div>
              </div>
              <div className="form-buttons">
                <button className="btn btn-primary" onClick={showEditModal ? handleEdit : handleAdd}>
                  {showEditModal ? "Save Changes" : "Add Course"}
                </button>
                <button className="btn btn-secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;