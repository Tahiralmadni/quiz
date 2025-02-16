import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import styles from './Settings.module.css';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const user = auth.currentUser;
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: '',
    theme: theme, // Use theme from context
    notifications: true
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (settings.newPassword && settings.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (settings.newPassword !== settings.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    try {
      if (user) {
        // Update display name
        await updateProfile(user, {
          displayName: settings.displayName
        });

        // Update email if changed
        if (settings.email !== user.email) {
          await updateEmail(user, settings.email);
        }

        // Update password if provided
        if (settings.newPassword) {
          if (validateForm()) {
            await updatePassword(user, settings.newPassword);
          } else {
            return;
          }
        }

        // Explicitly set theme
        setTheme(settings.theme);

        setSuccessMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      setErrors({ form: error.message });
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h1>Account Settings</h1>
      
      <form onSubmit={handleUpdateProfile} className={styles.settingsForm}>
        <div className={styles.formSection}>
          <h2>Personal Information</h2>
          <div className={styles.formGroup}>
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={settings.displayName}
              onChange={handleInputChange}
              placeholder="Enter your display name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Change Password</h2>
          <div className={styles.formGroup}>
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={settings.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className={errors.newPassword ? styles.errorInput : ''}
            />
            {errors.newPassword && (
              <span className={styles.errorMessage}>{errors.newPassword}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className={errors.confirmPassword ? styles.errorInput : ''}
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Preferences</h2>
          <div className={styles.formGroup}>
            <label>Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev, 
                  notifications: e.target.checked
                }))}
              />
              Enable Notifications
            </label>
          </div>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        {errors.form && (
          <div className={styles.errorMessage}>
            {errors.form}
          </div>
        )}

        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
