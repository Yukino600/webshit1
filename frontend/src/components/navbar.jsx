import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = (user) => {
    if (user.name) return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false);
  };

  const handleDropdownNavigation = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path) => isActiveLink(path) ? 'active' : '';

  const hasCustomAvatar = (user) => {
    return user.avatar && (
      user.avatar.startsWith('http') || 
      user.avatar.startsWith('data:image') || 
      user.avatar.startsWith('blob:')
    );
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">EduElite</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/" className={getLinkClass('/')}>Home</Link></li>
        <li><Link to="/courses" className={getLinkClass('/courses')}>Courses</Link></li>
        <li><Link to="/pricing" className={getLinkClass('/pricing')}>Pricing</Link></li>
        <li><Link to="/about" className={getLinkClass('/about')}>About</Link></li>

        {user ? (
          <li className="user-menu" ref={dropdownRef}>
            <div 
              className={`user-avatar ${showDropdown ? 'active' : ''}`} 
              onClick={toggleDropdown}
            >
              {hasCustomAvatar(user) ? (
                <img src={user.avatar} alt="avatar" className="avatar-image" />
              ) : (
                <span className="avatar-initials">{getUserInitials(user)}</span>
              )}
            </div>
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <div className="dropdown-header">
                <span className="user-name">{user.name || user.email}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <div className="dropdown-divider" />
              {user.isAdmin && (
                <div 
                  className="dropdown-item admin-item" 
                  onClick={() => handleDropdownNavigation('/admin')}
                >
                  🛠 Admin Panel
                </div>
              )}
              <div className="dropdown-item" onClick={() => handleDropdownNavigation('/profile')}>
                👤 Profile
              </div>
              <div className="dropdown-item" onClick={() => handleDropdownNavigation('/my-courses')}>
                📚 My Courses
              </div>
              <div className="dropdown-item" onClick={() => handleDropdownNavigation('/settings')}>
                ⚙️ Settings
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item logout-item" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login" className="login-link" onClick={() => setShowDropdown(false)}>
              Login / Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;