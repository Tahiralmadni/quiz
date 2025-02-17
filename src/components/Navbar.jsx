import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import styles from './Navbar.module.css';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Function to generate a consistent color based on a string
const getColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [totalQuizzesTaken, setTotalQuizzesTaken] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzesTaken = async () => {
      if (currentUser) {
        try {
          const quizHistoryRef = collection(db, 'quizHistory');
          const q = query(quizHistoryRef, where('userId', '==', currentUser.uid));
          const quizHistorySnapshot = await getDocs(q);
          setTotalQuizzesTaken(quizHistorySnapshot.docs.length);
        } catch (error) {
          console.error('Error fetching quiz history:', error);
        }
      }
    };

    fetchQuizzesTaken();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Get the first letter of display name or email
  const userInitial = currentUser?.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U');

  // Generate a consistent color based on user's name or email
  const iconColor = getColorFromString(currentUser?.displayName || currentUser?.email || 'User');

  return (
    <nav style={{backgroundColor:'#1261eb'}} className={styles.navbar}>
      <div style={{backgroundColor:'#1261eb'}} className={styles.navContainer}>
      <div style={{backgroundColor:'#1261eb'}} className={styles.logoSection}>
        <Link style={{backgroundColor:'#1261eb', color: 'white'}} to="/" className={styles.logo}>Quiz App</Link>
      </div>

      <div style={{backgroundColor:'#1261eb'}} className={styles.navLinks}>
        <Link style={{backgroundColor:'#1261eb', color: 'white'}} to="/home" className={styles.navLink}>Home</Link>
        <Link style={{backgroundColor:'#1261eb', color: 'white'}} to="/quiz-dashboard" className={styles.navLink}>
        Quiz Dashboard
        {totalQuizzesTaken > 0 && (
          <span style={{backgroundColor:'#ff4d4d'}} className={styles.quizBadge}>{totalQuizzesTaken}</span>
        )}
        </Link>
        <Link style={{backgroundColor:'#1261eb', color: 'white'}} to="/contact" className={styles.navLink}>Contact</Link>
        <Link style={{backgroundColor:'#1261eb', color: 'white'}} to="/about" className={styles.navLink}>About</Link>
      </div>

      <div style={{backgroundColor:'#1261eb'}} className={styles.navAuth}>
        {currentUser ? (
        <div style={{backgroundColor:'#1261eb'}} className={styles.userInfo}>
          <div 
          style={{backgroundColor:'#1261eb'}}
          className={styles.profileSection} 
          onClick={toggleProfileDropdown}
          >
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className={styles.profileIcon} 
                  />
                ) : (
                  <div 
                    className={styles.profileIconInitial}
                    style={{ 
                      backgroundColor: iconColor,
                      color: 'white'
                    }}
                  >
                    {userInitial}
                  </div>
                )}
              </div>
              
              {isProfileDropdownOpen && (
                <ProfileDropdown 
                  user={currentUser} 
                  onClose={() => setIsProfileDropdownOpen(false)} 
                  onLogout={handleLogout} 
                />
              )}
            </div>
          ) : (
            <div style={{backgroundColor:'#1261eb'}} className={styles.authButtons}>
              <Link style={{backgroundColor:'#1261eb', color: 'white', border: '1px solid white'}} to="/login" className={styles.loginBtn}>Login</Link>
              <Link style={{backgroundColor:'white', color: '#1261eb'}} to="/signup" className={styles.signupBtn}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
