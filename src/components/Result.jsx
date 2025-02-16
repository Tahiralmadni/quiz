import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import styles from './styles/Result.module.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if we have quiz results
    if (!location.state) {
      navigate('/quiz-categories');
      return;
    }
  }, [navigate, location]);

  const { 
    score, 
    total, 
    percentage,
    category,
    difficulty,
    timeSpent,
    isPassed
  } = location.state || {};

  useEffect(() => {
    const progressCircle = document.querySelector(`.${styles.progressCircle}`);
    if (progressCircle) {
      // First set initial state
      progressCircle.style.setProperty('--percentage-angle', '0deg');
      
      // Then trigger animation after a small delay
      setTimeout(() => {
        progressCircle.style.setProperty('--percentage-angle', `${percentage}%`);
      }, 100);
    }
  }, [percentage]);

  const getResultMessage = () => {
    if (percentage >= 90) return "Excellent! You're a Quiz Master!";
    if (percentage >= 70) return "Great job! Keep improving!";
    if (percentage >= 50) return "Good effort. You can do better!";
    return "Keep practicing. Learning is a journey!";
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleRetry = () => {
    navigate('/quiz-categories');
  };

  const handleDashboard = () => {
    navigate('/quiz-dashboard');
  };

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultCard}>
        <h1>Quiz Results</h1>
        
        <div className={styles.resultContent}>
          <h2>{getResultMessage()}</h2>
          
          <div className={styles.scoreDetails}>
            <div className={styles.scoreItem}>
              <span>Category:</span>
              <strong>{category}</strong>
            </div>
            <div className={styles.scoreItem}>
              <span>Difficulty:</span>
              <strong>{difficulty}</strong>
            </div>
            <div className={styles.scoreItem}>
              <span>Score:</span>
              <strong>{score} / {total}</strong>
            </div>
            <div className={styles.scoreItem}>
              <span>Percentage:</span>
              <strong>{percentage}%</strong>
            </div>
            <div className={styles.scoreItem}>
              <span>Time Taken:</span>
              <strong>{formatTime(timeSpent)}</strong>
            </div>
            <div className={styles.scoreItem}>
              <span>Status:</span>
              <strong className={isPassed ? styles.passed : styles.failed}>
                {isPassed ? 'Passed' : 'Failed'}
              </strong>
            </div>
          </div>

          <div className={styles.progressCircle}>
            <span>{percentage}%</span>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={handleRetry} className={styles.retryButton}>
              Try Another Quiz
            </button>
            <button onClick={handleDashboard} className={styles.dashboardButton}>
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;