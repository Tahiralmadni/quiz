import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTrophy, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.footerBackground}>
      <footer className={styles.footer}>
      <div className={styles.footerWrapper}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>About QuizMaster</h3>
            <p className={styles.aboutText}>
              Empowering learners through interactive quizzes 
              and personalized learning experiences.
            </p>
            <div className={styles.certifications}>
              <div className={styles.certificationItem}>
                <FaTrophy className={styles.certIcon} />
                <span>Award-Winning Platform</span>
              </div>
              <div className={styles.certificationItem}>
                <FaGlobe className={styles.certIcon} />
                <span>Global Learning Platform</span>
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <div className={styles.navigationGrid}>
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Learn</h4>
                <ul className={styles.linkList}>
                  <li><Link to="/quiz-categories">Categories</Link></li>
                  <li><Link to="/quiz-dashboard">Dashboard</Link></li>
                  <li><Link to="/scoreboard">Leaderboard</Link></li>
                </ul>
              </div>
              <div className={styles.navColumn}>
                <h4 className={styles.columnTitle}>Support</h4>
                <ul className={styles.linkList}>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/help">Help Center</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Connect With Us</h3>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.legalLinks}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
          <p className={styles.copyright}>&copy; {currentYear} QuizMaster. All Rights Reserved.</p>
        </div>
      </div>
      </footer>
    </div>
  );
};

export default Footer;

