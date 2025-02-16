import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import QuizLoader from './QuizLoader';
import styles from './styles/QuizDashboard.module.css';

const QuizDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalQuizzesTaken: 0,
    averageScore: '0.00',
    topPerformingCategories: []
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [hideFooter, setHideFooter] = useState(false);





  useEffect(() => {
    const fetchQuizStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Get user's quiz results from Firestore
        const quizResultsRef = collection(db, 'quizResults');
        const q = query(quizResultsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const quizData = [];
        querySnapshot.forEach((doc) => {
          quizData.push(doc.data());
        });

        // Calculate stats from actual quiz data
        const totalQuizzesTaken = quizData.length;
        const averageScore = totalQuizzesTaken 
          ? (quizData.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzesTaken).toFixed(2)
          : '0.00';

        // Group by category and calculate average scores
        const categoryScores = quizData.reduce((acc, quiz) => {
          if (!acc[quiz.category]) {
            acc[quiz.category] = { total: 0, count: 0 };
          }
          acc[quiz.category].total += quiz.score;
          acc[quiz.category].count += 1;
          return acc;
        }, {});

        const topPerformingCategories = Object.entries(categoryScores)
          .map(([category, data]) => ({
            category,
            percentage: (data.total / data.count).toFixed(2)
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 3);

        setUserStats({
          totalQuizzesTaken,
          averageScore,
          topPerformingCategories
        });

        setRecentQuizzes(quizData.slice(-3).reverse());
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching quiz stats:', error);
        setIsLoading(false);
      }
    };

    fetchQuizStats();
  }, [navigate]);


  const dailyChallenges = [
    { 
      title: 'Pakistan Trivia', 
      description: 'Test your knowledge about Pakistan',
      difficulty: 'Easy',
      reward: '50 XP'
    },
    { 
      title: 'World Geography', 
      description: 'Explore global geographical facts',
      difficulty: 'Medium',
      reward: '100 XP'
    },
    { 
      title: 'Science Basics', 
      description: 'Discover fascinating scientific concepts',
      difficulty: 'Hard',
      reward: '200 XP'
    }
  ];

  const startQuiz = () => {
    navigate('/quiz-categories');
  };


  const viewHistory = () => {
    navigate('/scoreboard');
  };

  if (isLoading) {
    return <QuizLoader />;
  }

  return (

      <motion.div 
        className={styles.dashboardContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        
        <div className={styles.dashboardContent}>
          <div className={styles.statsHeader}>
            <motion.h1 
              className={styles.dashboardTitle}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Quiz Dashboard
            </motion.h1>
            <motion.div 
              className={styles.overallStats}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.statCard}>
                <h3>Total Quizzes</h3>
                <p className={styles.statValue}>{userStats.totalQuizzesTaken}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Average Score</h3>
                <p className={styles.statValue}>{userStats.averageScore}%</p>
              </div>
            </motion.div>
          </div>

            <motion.div 
            className={styles.topCategories}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            >
            <h2>Top Performing Categories</h2>
            {userStats.topPerformingCategories.length > 0 ? (
              <div className={styles.categoriesList}>
              {userStats.topPerformingCategories.map((category, index) => (
                <motion.div 
                key={category.category}
                className={styles.categoryCard}
                whileHover={{ scale: 1.05 }}
                >
                <h3>{category.category}</h3>
                <div className={styles.progressBar}>
                  <div 
                  className={styles.progress}
                  style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p>{category.percentage}%</p>
                </motion.div>
              ))}
              </div>
            ) : (
              <p className={styles.noDataMessage}>No quiz data available yet. Take your first quiz to see your performance!</p>
            )}
            </motion.div>


            <div className={styles.actionButtons}>
              <button onClick={startQuiz} className={styles.primaryButton}>Start Quiz</button>
              <button onClick={() => navigate('/scoreboard')} className={styles.secondaryButton}>View History</button>
              <button onClick={() => navigate('/scoreboard')} className={styles.whiteButton}>Leaderboard</button>
              <button onClick={() => navigate('/settings')} className={styles.softButton}>Settings</button>
            </div>
            </div>
            {!hideFooter && <Footer />}
          </motion.div>
          );
        };


export default QuizDashboard;
