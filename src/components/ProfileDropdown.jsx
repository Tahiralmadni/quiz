import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfileDropdown.module.css';

// Function to generate a consistent color based on a string
const getColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const ProfileDropdown = ({ onClose }) => {
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get the first letter of display name or email
  const userInitial = currentUser?.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U');

  // Generate a consistent color based on user's name or email
  const iconColor = getColorFromString(currentUser?.displayName || currentUser?.email || 'User');

  const handleItemClick = (path) => {
    if (path === '/quiz-dashboard') {
      // Ensure navigation to actual dashboard, not categories
      navigate('/quiz-dashboard', { 
        state: { 
          fromProfileDropdown: true 
        } 
      });
    } else {
      navigate(path);
    }
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.profileDropdown} ref={dropdownRef}>
      <div className={styles.userProfile}>
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            className={styles.profileImage} 
          />
        ) : (
          <div 
            className={styles.userAvatarInitial}
            style={{ 
              backgroundColor: iconColor,
              color: 'white'
            }}
          >
            {userInitial}
          </div>
        )}
        <div className={styles.userDetails}>
          <h3>{currentUser?.displayName || 'User'}</h3>
          <p>{currentUser?.email}</p>
        </div>
      </div>

      <div className={styles.dropdownMenu}>
        <ul>
          <li onClick={() => handleItemClick('/profile')}>
            <i className="fas fa-user" style={{color: getColorFromString('profile')}}></i>
            <span>My Profile</span>
          </li>
          <li onClick={() => handleItemClick('/settings')}>
            <i className="fas fa-cog" style={{color: getColorFromString('settings')}}></i>
            <span>Settings</span>
          </li>
          <li onClick={() => handleItemClick('/quiz-dashboard')}>
            <i className="fas fa-chart-bar" style={{color: getColorFromString('dashboard')}}></i>
            <span>Quiz Dashboard</span>
          </li>
        </ul>
      </div>

      <div className={styles.dropdownFooter}>
        <button 
          className={styles.logoutButton} 
          onClick={handleLogout}
        >
          <i 
            className="fas fa-sign-out-alt" 
            style={{color: getColorFromString('logout')}}
          ></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
