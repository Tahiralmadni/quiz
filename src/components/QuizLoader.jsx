import React from 'react';
import styles from './styles/QuizLoader.module.css';

const QuizLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <div className={styles.loaderSpinner}></div>
        <h2 className={styles.loaderTitle}>Quiz Master</h2>
        <p className={styles.loaderSubtitle}>Preparing your quiz experience...</p>
      </div>
    </div>
  );
};

export default QuizLoader;
