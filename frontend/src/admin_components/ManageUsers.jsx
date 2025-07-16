// src/admin_components/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data);
        setError("");
      } else {
        setError(data.message || "Failed to load users.");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    const confirmText = isBlocked ? "Unblock" : "Block";
    if (!window.confirm(`Are you sure you want to ${confirmText} this user?`)) return;

    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blocked: !isBlocked }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchUsers();
        alert(`${confirmText}ed successfully`);
      } else {
        alert(data.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Toggle block error:", err);
      alert("Network error.");
    }
  };

  return (
    <div className="courses-section">
      <div className="section-header">
        <h2>👥 Manage Users</h2>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error">❌ {error}</div>
      ) : users.length === 0 ? (
        <div className="loading">No users found.</div>
      ) : (
        <div className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Block</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name || u.email}</td>
                  <td>{u.isAdmin ? "Admin" : "User"}</td>
                  <td>{u.blocked ? "Blocked" : "Active"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleBlockToggle(u._id, u.blocked)}
                    >
                      {u.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
// Note: Ensure you have the necessary backend API endpoints set up for user management.
// The endpoint for fetching users is assumed to be `GET /api/admin/users`