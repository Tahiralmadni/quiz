import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { showToast } from '../Toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Force logout and prevent authenticated access
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // If there's a current user, sign them out
        if (auth.currentUser) {
          console.log('Forcing logout of existing session');
          await signOut(auth);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user.email);
        navigate('/home');
      }
    });

    checkAuthState();

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setErrors({});
    setIsLoading(true);

    // Basic validation
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password.trim()
      );
      
      // If successful, navigate to home
      if (userCredential.user) {
        console.log('Login successful, navigating to home');
        setIsLoading(false);
        
        // Use React Router's navigation instead of window.location
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Handle specific Firebase authentication errors
      switch (error.code) {
        case 'auth/invalid-email':
          setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
          break;
        case 'auth/user-not-found':
          setErrors(prev => ({ ...prev, firebase: 'No user found with this email' }));
          break;
        case 'auth/wrong-password':
          setErrors(prev => ({ ...prev, password: 'Incorrect password' }));
          break;
        default:
          setErrors(prev => ({ ...prev, firebase: 'Login failed. Please try again.' }));
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            className={errors.email ? 'error' : ''} 
            disabled={isLoading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            className={errors.password ? 'error' : ''} 
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        {errors.firebase && <div className="firebase-error">{errors.firebase}</div>}
        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="signup-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;
