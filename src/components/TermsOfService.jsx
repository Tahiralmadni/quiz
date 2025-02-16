import React from 'react';
import styles from './TermsOfService.module.css';

const TermsOfService = () => {
  return (
    <div className={styles.termsContainer}>
      <div className={styles.termsContent}>
        <h1>Terms of Service</h1>
        
        <section className={styles.termsSection}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using QuizMaster, you agree to these terms of service. Please read them carefully.</p>
        </section>

        <section className={styles.termsSection}>
          <h2>2. User Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
        </section>

        <section className={styles.termsSection}>
          <h2>3. User Conduct</h2>
          <p>You agree not to use the platform for any unlawful purposes or to harass, abuse, or harm other users.</p>
        </section>

        <section className={styles.termsSection}>
          <h2>4. Intellectual Property</h2>
          <p>All content on QuizMaster, including quizzes, design, and text, is the property of QuizMaster and protected by copyright laws.</p>
        </section>

        <section className={styles.termsSection}>
          <h2>5. Limitation of Liability</h2>
          <p>QuizMaster is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.</p>
        </section>

        <section className={styles.termsSection}>
          <h2>6. Modifications to Service</h2>
          <p>We reserve the right to modify or discontinue the service at any time without notice.</p>
        </section>

        <p className={styles.acceptanceNote}>By using QuizMaster, you acknowledge that you have read and agree to these terms.</p>
      </div>
    </div>
  );
};

export default TermsOfService;