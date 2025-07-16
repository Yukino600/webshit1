// src/admin_components/AdminApp.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import AdminPanel from "./AdminPanel";
import ManageCourses from "./ManageCourses";
import ManageUsers from "./ManageUsers";

const AdminApp = ({ user, onLogout }) => {
  const location = useLocation();

  useEffect(() => {
    if (!user?.isAdmin) {
      // Block non-admins from accessing admin routes
      return <Navigate to="/" />;
    }
  }, [user]);

  return (
    <div className="admin-panel">
      <AdminNavbar onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<AdminPanel user={user} />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="settings" element={<div>Settings Page</div>} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </div>
  );
};

export default AdminApp;
