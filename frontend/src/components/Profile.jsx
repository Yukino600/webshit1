import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar] = useState(
    user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`
  );
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedAvatar = preview || avatar;

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name,
          avatar: updatedAvatar
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updated = await res.json();

      localStorage.setItem("userToken", updated.token);
      
      if (setUser) {
        setUser(updated);
      }

      setEditing(false);
      
      // Show success animation
      const successMsg = document.querySelector('.success-message');
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
      }
      
    } catch (err) {
      console.error("Profile update failed:", err);
      const errorMsg = document.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.classList.add('show');
        setTimeout(() => errorMsg.classList.remove('show'), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>User not found</h3>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Background decoration */}
        <div className="profile-bg-decoration"></div>
        
        {/* Success/Error messages */}
        <div className="success-message">
          <span className="message-icon">✅</span>
          Profile updated successfully!
        </div>
        <div className="error-message">
          <span className="message-icon">❌</span>
          Failed to update profile. Please try again.
        </div>

        <div className="profile-header">
          <div className="avatar-container">
            <img
              src={preview || user.avatar || avatar}
              alt="Avatar"
              className="profile-avatar"
            />
            <div className="avatar-badge">
              {user.isAdmin ? (
                <span className="admin-badge">👑</span>
              ) : (
                <span className="student-badge">🎓</span>
              )}
            </div>
            {editing && (
              <div className="avatar-overlay">
                <label htmlFor="avatar-input" className="avatar-upload-btn">
                  📷
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="profile-role">
              {user.isAdmin ? 'Administrator' : 'Student'}
            </p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-label">Member since</span>
                <span className="stat-value">
                  {user.iat ? new Date(user.iat * 1000).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-section">
              <h3>Edit Profile</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="form-input"
                    disabled
                  />
                  <small className="form-hint">Email cannot be changed</small>
                </div>
              </div>
              
              {preview && (
                <div className="avatar-preview-section">
                  <label>New Avatar Preview</label>
                  <div className="avatar-preview">
                    <img src={preview} alt="Preview" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setPreview(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-content">
            <div className="info-section">
              <h3>Account Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div>
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">🔐</div>
                  <div>
                    <label>Account Type</label>
                    <p>{user.isAdmin ? 'Administrator' : 'Student Account'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📅</div>
                  <div>
                    <label>Last Login</label>
                    <p>{user.iat ? new Date(user.iat * 1000).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">✅</div>
                  <div>
                    <label>Status</label>
                    <p className="status-active">Active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-section">
              <div className="action-buttons">
                <button 
                  onClick={() => setEditing(true)}
                  className="btn btn-primary"
                >
                  <span className="btn-icon">✏️</span>
                  Edit Profile
                </button>
                <button className="btn btn-danger">
                  <span className="btn-icon">🗑️</span>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;