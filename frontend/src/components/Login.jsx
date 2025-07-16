// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("Login component mounted");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const endpoint = isLogin
      ? "http://localhost:5000/api/users/login"
      : "http://localhost:5000/api/users/register";

    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userToken", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        
        // Enhanced user info with admin status
        const userInfo = { 
          ...payload, 
          token: data.token,
          isAdmin: payload.isAdmin || payload.role === 'admin' || false
        };
        
        // Show success message with admin indicator
        const adminIndicator = userInfo.isAdmin ? " (Admin)" : "";
        setMessage("✅ " + (isLogin ? `Login successful!${adminIndicator}` : "Registration successful!"));
        
        // Clear form
        setFormData({ name: "", email: "", password: "" });
        
        // Update user state first
        console.log("Calling onLogin with:", userInfo);
        onLogin(userInfo);
        
        // Navigate after a short delay
        setTimeout(() => {
          console.log("Navigating to home page");
          navigate("/", { replace: true });
        }, 1000);
        
      } else {
        setMessage(data.message || "❌ Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      setMessage("❌ Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to EduElite</h1>
          <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
          <p>
            {isLogin 
              ? "Welcome back! Please sign in to your account." 
              : "Join thousands of learners on their educational journey."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`btn primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="switch-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setFormData({ name: "", email: "", password: "" });
              }}
              disabled={isLoading}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;