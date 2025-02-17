import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, serverTimestamp } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
        newErrors.username = t('auth.errors.username_required');
      } else if (formData.username.length < 3) {
        newErrors.username = t('auth.errors.username_length');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = t('auth.errors.email_required');
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = t('auth.errors.invalid_email_format');
      }

      if (!formData.password) {
        newErrors.password = t('auth.errors.password_required');
      } else if (formData.password.length < 8) {
        newErrors.password = t('auth.errors.password_length');
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.passwords_not_match');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password.trim()
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        bio: '',
        totalQuizzesTaken: 0,
        totalScore: 0,
        createdAt: serverTimestamp()
      });

      await updateProfile(user, {
        displayName: formData.username || formData.email.split('@')[0]
      });

      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);

      switch (error.code) {
        case 'auth/email-already-in-use':
            setErrors(prev => ({ ...prev, email: t('auth.errors.email_in_use') }));
            break;
          case 'auth/invalid-email':
            setErrors(prev => ({ ...prev, email: t('auth.errors.invalid_email') }));
          break;
        default:
          setErrors(prev => ({ ...prev, firebase: error.message }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <form onSubmit={handleSubmit} className="signup-form">
            <h2>{t('auth.create_account')}</h2>
            <p className="signup-subtitle">{t('auth.join_community')}</p>
            
            <div className="form-group">
            <label htmlFor="username">{t('auth.username')}</label>
            <input 
              type="text" 
              id="username"
              name="username" 
              placeholder={t('auth.username')}
              value={formData.username} 
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder={t('auth.email')}
              value={formData.email} 
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder={t('auth.password')}
              value={formData.password} 
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirm_password')}</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword" 
              placeholder={t('auth.confirm_password')}
              value={formData.confirmPassword} 
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          {errors.firebase && <div className="firebase-error">{errors.firebase}</div>}
          
          <button 
          style={{color:'white'}}
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? t('auth.creating_account') : t('auth.signup_button')}
          </button>
          
          <div className="login-link">
            {t('auth.have_account')} <Link to="/login">{t('auth.login')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
