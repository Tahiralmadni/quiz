import React from 'react';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.privacyContainer}>
      <div className={styles.privacyContent}>
        <h1>Privacy Policy</h1>
        
        <section className={styles.privacySection}>
          <h2>1. Information We Collect</h2>
          <p>At QuizMaster, we collect information to provide and improve our services:</p>
          <ul>
            <li>Personal information (name, email) during account creation</li>
            <li>Quiz performance and learning progress</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section className={styles.privacySection}>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Personalize your learning experience</li>
            <li>Improve our quiz platform</li>
            <li>Send important account and service updates</li>
            <li>Provide customer support</li>
          </ul>
        </section>

        <section className={styles.privacySection}>
          <h2>3. Data Protection</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li>Encrypted data storage</li>
            <li>Secure authentication mechanisms</li>
            <li>Regular security audits</li>
            <li>Limited data access for our team</li>
          </ul>
        </section>

        <section className={styles.privacySection}>
          <h2>4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request data deletion</li>
            <li>Opt-out of marketing communications</li>
            <li>Update your account information</li>
          </ul>
        </section>

        <section className={styles.privacySection}>
          <h2>5. Cookies and Tracking</h2>
          <p>We use cookies to enhance user experience and analyze platform usage. You can manage cookie preferences in your browser settings.</p>
        </section>

        <section className={styles.privacySection}>
          <h2>6. Third-Party Services</h2>
          <p>We may use third-party services for analytics and improvements. These services are GDPR and CCPA compliant.</p>
        </section>

        <section className={styles.privacySection}>
          <h2>7. Contact Us</h2>
          <p>For privacy concerns or questions, contact us at: privacy@quizmaster.com</p>
        </section>

        <p className={styles.lastUpdated}>Last Updated: December 2023</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;