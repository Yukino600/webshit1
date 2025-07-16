import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './components/Home';
import Login from './components/Login';
import About from './components/About';
import Pricing from './components/Pricing';
import CoursesList from './components/CoursesList';
import CourseDetail from './components/CourseDetail';
import AdminApp from './admin_components/AdminApp';
import ChatbotWidget from './components/ChatbotWidget';
import Profile from './components/Profile';
import Settings from './components/Settings';
import MyCourses from './components/MyCourse';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = { ...payload, token };
        setUser(userInfo);
      } catch (err) {
        console.error("Token parsing error:", err);
        localStorage.removeItem('userToken');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userInfo) => setUser(userInfo);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        {user && <ChatbotWidget />}

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/courses" element={user ? <CoursesList user={user} /> : <Navigate to="/login" />} />
          <Route path="/courses/:id" element={user ? <CourseDetail /> : <Navigate to="/login" />} />
          <Route path="/add-course" element={user ? <div>Add Course Coming Soon</div> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/my-courses" element={user ? <MyCourses user={user} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/admin/*" element={user?.isAdmin ? <AdminApp user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
