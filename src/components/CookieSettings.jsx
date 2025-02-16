import React, { useState } from 'react';
import styles from './CookieSettings.module.css';

const CookieSettings = () => {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [performanceConsent, setPerformanceConsent] = useState(false);

  const handleConsentChange = (type) => {
    switch(type) {
      case 'analytics':
        setAnalyticsConsent(!analyticsConsent);
        break;
      case 'marketing':
        setMarketingConsent(!marketingConsent);
        break;
      case 'performance':
        setPerformanceConsent(!performanceConsent);
        break;
    }
  };

  const saveConsent = () => {
    // Implement actual consent saving logic
    alert('Cookie preferences saved!');
  };

  return (
    <div className={styles.cookieContainer}>
      <div className={styles.cookieContent}>
        <h1>Cookie Settings</h1>
        
        <section className={styles.cookieSection}>
          <h2>Manage Your Cookie Preferences</h2>
          <p>Customize how cookies are used on QuizMaster</p>
        </section>

        <section className={styles.cookieSection}>
          <div className={styles.cookieOption}>
            <div className={styles.optionDetails}>
              <h3>Necessary Cookies</h3>
              <p>Always enabled. These are essential for basic site functionality.</p>
            </div>
            <div className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={true} 
                disabled 
                className={styles.checkbox}
              />
              <span className={styles.slider}></span>
            </div>
          </div>

          <div className={styles.cookieOption}>
            <div className={styles.optionDetails}>
              <h3>Analytics Cookies</h3>
              <p>Help us understand how users interact with our platform.</p>
            </div>
            <div className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={analyticsConsent}
                onChange={() => handleConsentChange('analytics')}
                className={styles.checkbox}
              />
              <span className={styles.slider}></span>
            </div>
          </div>

          <div className={styles.cookieOption}>
            <div className={styles.optionDetails}>
              <h3>Marketing Cookies</h3>
              <p>Used to track your browsing habits and show personalized ads.</p>
            </div>
            <div className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={marketingConsent}
                onChange={() => handleConsentChange('marketing')}
                className={styles.checkbox}
              />
              <span className={styles.slider}></span>
            </div>
          </div>

          <div className={styles.cookieOption}>
            <div className={styles.optionDetails}>
              <h3>Performance Cookies</h3>
              <p>Help improve site speed and user experience.</p>
            </div>
            <div className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={performanceConsent}
                onChange={() => handleConsentChange('performance')}
                className={styles.checkbox}
              />
              <span className={styles.slider}></span>
            </div>
          </div>
        </section>

        <div className={styles.cookieActions}>
          <button 
            className={styles.saveButton}
            onClick={saveConsent}
          >
            Save Preferences
          </button>
        </div>

        <p className={styles.disclaimer}>
          These preferences will be stored in your browser and can be changed at any time.
        </p>
      </div>
    </div>
  );
};

export default CookieSettings;
