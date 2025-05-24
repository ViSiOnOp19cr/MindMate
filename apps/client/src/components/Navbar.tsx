import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="logo">MindMate</Link>
        </div>
        
        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`navbar-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/notes" 
            className={`navbar-item ${isActive('/notes') ? 'active' : ''}`}
          >
            Notes
          </Link>
          <Link 
            to="/ai-chat" 
            className={`navbar-item ${isActive('/ai-chat') ? 'active' : ''}`}
          >
            AI Chat
          </Link>
        </div>
        
        <div className="navbar-actions">
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
