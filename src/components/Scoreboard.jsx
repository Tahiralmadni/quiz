import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';
import styles from './styles/Scoreboard.module.css';
import { ThemeContext } from '../contexts/ThemeContext';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchScores = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const scoresRef = collection(db, 'quizResults');
        const q = query(
          scoresRef, 
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot size:', querySnapshot.size);
        
        const fetchedScores = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Document data:', data);
          if (data.score && data.category && data.difficulty) {
            fetchedScores.push({
              id: doc.id,
              ...data
            });
          }
        });

        // Sort scores by timestamp to show most recent first
        fetchedScores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        console.log('Processed scores:', fetchedScores);
        
        setScores(fetchedScores);
        
        // Find best score
        if (fetchedScores.length > 0) {
          const best = fetchedScores.reduce((prev, current) => 
            (current.score > prev.score) ? current : prev
          );
          setBestScore(best);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
        showToast.error('Failed to load scores');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [navigate]);

  if (loading) {
    return (
      <div className={`${styles.scoreboardContainer} ${theme === 'light' ? styles.light : ''}`}>
        <div className={styles.loading}>Loading your achievements...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.scoreboardContainer} ${theme === 'light' ? styles.light : ''}`}>
      <div className={styles.scoreboardContent}>
        <h1 className={styles.title}>Scoreboard</h1>
        
        {bestScore && (
          <div className={styles.bestScore}>
            <h2>Personal Best</h2>
            <div className={styles.bestScoreDetails}>
              <div className={styles.scoreCategory}>
                <h3>{bestScore.category}</h3>
                <span className={styles.difficulty}>{bestScore.difficulty}</span>
              </div>
              <div className={styles.scoreValue}>
                <span className={styles.percentage}>{bestScore.score}%</span>
                <span className={`${styles.status} ${bestScore.isPassed ? styles.passed : styles.failed}`}>
                  {bestScore.isPassed ? 'Passed' : 'Failed'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.scoreList}>
          <h2>All Attempts</h2>
          {scores.map((score) => (
            <div key={score.id} className={`${styles.scoreItem} ${score.id === bestScore?.id ? styles.bestAttempt : ''}`}>
              <div className={styles.scoreCategory}>
                <h3>{score.category}</h3>
                <span className={styles.difficulty}>{score.difficulty}</span>
              </div>
              <div className={styles.scoreDetails}>
                <div className={styles.scoreValue}>
                  <span className={styles.percentage}>{score.score}%</span>
                  <span className={`${styles.status} ${score.isPassed ? styles.passed : styles.failed}`}>
                    {score.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className={styles.date}>
                  {new Date(score.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {scores.length === 0 && (
            <div className={styles.noScores}>
              <p>No quiz attempts yet. Start your journey!</p>
            </div>
          )}
        </div>
        <button className={styles.newQuizButton} onClick={() => navigate('/quiz-categories')}>
          Take a New Quiz
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;