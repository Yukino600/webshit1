// src/admin_components/AdminNavbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./admin.css";

const AdminNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <h2 className="admin-title">🛠 Admin Dashboard</h2>
        <p className="admin-user">Welcome, {user?.name || user?.email}</p>
      </div>
      
      <ul className="admin-nav-links">
        <li>
          <NavLink 
            to="/admin" 
            end 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            User Management
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/courses" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Course Management
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Settings
          </NavLink>
        </li>
      </ul>

      <div className="admin-nav-actions">
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handleBackToMain}
        >
          ← Back to Main Site
        </button>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;