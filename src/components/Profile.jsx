import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const QUIZ_CATEGORIES = [
  'General Knowledge', 
  'Science', 
  'History', 
  'Geography', 
  'Sports', 
  'Movies', 
  'Technology'
];

const ACHIEVEMENT_CRITERIA = [
  {
    id: 'quiz_starter',
    name: 'Quiz Starter 🚀',
    description: 'Complete your first quiz',
    condition: (userData) => userData.totalQuizzesTaken >= 1
  },
  {
    id: 'quiz_enthusiast',
    name: 'Quiz Enthusiast 📚',
    description: 'Complete 5 quizzes',
    condition: (userData) => userData.totalQuizzesTaken >= 5
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker 🧠',
    description: 'Complete 10 quizzes',
    condition: (userData) => userData.totalQuizzesTaken >= 10
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master 🏆',
    description: 'Average score above 80%',
    condition: (userData) => userData.totalScore >= 80
  },
  {
    id: 'perfect_score',
    name: 'Perfect Performance 💯',
    description: 'Get a 100% score in any quiz',
    condition: (userData) => userData.highestSingleQuizScore === 100
  }
];

const generateCategoryAchievements = (quizHistory) => {
  const categoryAchievements = {};

  // Group quizzes by category
  const categoryStats = quizHistory.reduce((acc, quiz) => {
    if (!acc[quiz.category]) {
      acc[quiz.category] = {
        totalQuizzes: 0,
        totalScore: 0,
        perfectScores: 0
      };
    }
    
    acc[quiz.category].totalQuizzes++;
    acc[quiz.category].totalScore += quiz.score || 0;
    
    if (quiz.score === 100) { // Changed from 10 to 100 for percentage
      acc[quiz.category].perfectScores++;
    }

    return acc;
  }, {});

  // Generate achievements for each category
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const achievements = [];

    if (stats.totalQuizzes >= 1) {
      achievements.push({
        id: `${category.toLowerCase().replace(' ', '_')}_starter`,
        name: `${category} Starter 🌱`,
        description: `Completed first ${category} quiz`
      });
    }

    if (stats.totalQuizzes >= 3) {
      achievements.push({
        id: `${category.toLowerCase().replace(' ', '_')}_enthusiast`,
        name: `${category} Enthusiast 🏅`,
        description: `Completed 3 ${category} quizzes`
      });
    }

    // Average score above 80%
    if (stats.totalQuizzes > 0 && (stats.totalScore / stats.totalQuizzes) >= 80) {
      achievements.push({
        id: `${category.toLowerCase().replace(' ', '_')}_expert`,
        name: `${category} Expert 🎯`,
        description: `Average score above 80% in ${category}`
      });
    }

    if (stats.perfectScores >= 1) {
      achievements.push({
        id: `${category.toLowerCase().replace(' ', '_')}_master`,
        name: `${category} Master 🏆`,
        description: `Perfect score in ${category} quiz`
      });
    }

    categoryAchievements[category] = achievements;
  });

  return categoryAchievements;
};

const Profile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { theme } = useTheme();
  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    totalQuizzesTaken: 0,
    totalScore: 0,
    highestSingleQuizScore: 0,
    achievements: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    bio: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userQuizHistory, setUserQuizHistory] = useState([]);
  const [categoryAchievements, setCategoryAchievements] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // Fetch quiz history
        const quizHistoryRef = collection(db, 'quizResults');
        const q = query(quizHistoryRef, where('userId', '==', user.uid));
        const quizHistorySnapshot = await getDocs(q);
        const quizHistory = quizHistorySnapshot.docs.map(doc => ({
          quizName: `${doc.data().category} - ${doc.data().difficulty}`,
          score: doc.data().score,
          timestamp: doc.data().timestamp,
          isPassed: doc.data().isPassed
        }));

        // Sort quiz history by timestamp
        quizHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Calculate highest single quiz score
        const highestSingleQuizScore = Math.max(...quizHistory.map(quiz => quiz.score));

        if (userDoc.exists()) {
          const data = userDoc.data();
          const updatedUserData = {
            username: data.username || user.email.split('@')[0],
            bio: data.bio || '',
            totalQuizzesTaken: quizHistory.length,
            totalScore: Math.round(
            quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / 
            (quizHistory.length || 1)
            ),
            highestSingleQuizScore,
            achievements: data.achievements || {}

          };

          // Dynamically generate achievements
          const earnedAchievements = ACHIEVEMENT_CRITERIA
            .filter(achievement => achievement.condition(updatedUserData))
            .map(achievement => ({
              id: achievement.id,
              name: achievement.name,
              description: achievement.description
            }));

          updatedUserData.achievements = earnedAchievements;

          // Generate category-specific achievements
          const categoryAchievementsData = generateCategoryAchievements(quizHistory);
          
          // Update Firestore with new achievements
          await updateDoc(userDocRef, {
            achievements: { ...updatedUserData.achievements, ...categoryAchievementsData }
          });

          setUserData(updatedUserData);
          setEditData({
            username: updatedUserData.username,
            bio: updatedUserData.bio
          });
          setUserQuizHistory(quizHistory);
          setCategoryAchievements(categoryAchievementsData);
        }
      } catch (fetchError) {
        console.error('Error fetching user data:', fetchError);
        setError(fetchError.message || 'Failed to load profile. Please try again.');
        // Add Sentry or other error tracking if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!editData.username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        username: editData.username.trim(),
        bio: editData.bio.trim()
      });

      await updateProfile(user, {
        displayName: editData.username.trim()
      });

      setUserData(prev => ({
        ...prev,
        username: editData.username.trim(),
        bio: editData.bio.trim()
      }));

      setIsEditing(false);
      setError(null);
    } catch (updateError) {
      console.error('Error updating profile:', updateError);
      setError(updateError.message || 'Failed to update profile. Please try again.');
    }
  };

  const getProfileInitials = () => {
    if (userData.username) {
      return userData.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} ${theme === 'light' ? styles.light : ''}`}>
        <div className={styles.loader}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.errorContainer} ${theme === 'light' ? styles.light : ''}`}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`${styles.profileContainer} ${theme === 'light' ? styles.light : ''}`}>
      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          <span>{getProfileInitials()}</span>
        </div>
        {isEditing ? (
          <div className={styles.profileEditForm}>
          <input
            type="text"
            name="username"
            value={editData.username}
            onChange={handleInputChange}
            placeholder="Username"
            className={styles.editInput}
            maxLength={30}
          />
          <textarea
            name="bio"
            value={editData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            className={styles.editBio}
            maxLength={200}
          />
          <div className={styles.editButtons}>
            <button onClick={handleSaveProfile} className={styles.saveButton}>
            Save Profile
            </button>
            <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
            Cancel
            </button>
          </div>
          </div>
        ) : (
          <div className={styles.profileInfo}>
          <h2>{userData.username}</h2>
          <p>{userData.bio || 'No bio yet'}</p>
          <button onClick={() => setIsEditing(true)} className={styles.editProfileButton}>
            Edit Profile
          </button>
          </div>
        )}
        </div>

        <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>Quizzes Taken</h3>
          <p>{userData.totalQuizzesTaken}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Average Score</h3>
          <p>{userData.totalScore}%</p>
        </div>
        <div className={styles.statCard}>
          <h3>Highest Score</h3>
          <p>{userData.highestSingleQuizScore}%</p>
        </div>
        </div>


      <div className={styles.achievementsSection}>
        <h3>Achievements</h3>
        <div className={styles.achievementsList}>
          {Object.keys(userData.achievements).length > 0 ? (
            Object.keys(userData.achievements).map(achievement => (
              <div key={achievement} className={styles.achievementItem}>
                <div className={styles.achievementDetails}>
                  <h4>{userData.achievements[achievement].name}</h4>
                  <p>{userData.achievements[achievement].description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No achievements yet. Keep taking quizzes!</p>
          )}
        </div>
      </div>

      <div className={styles.categoryAchievementsSection}>
        <h3>Category Achievements</h3>
        <div className={styles.categoryAchievementsList}>
          {Object.entries(categoryAchievements).length > 0 ? (
            Object.entries(categoryAchievements).map(([category, achievements]) => (
              <div key={category} className={styles.categoryAchievements}>
                <h4>{category} Achievements</h4>
                {achievements.map(achievement => (
                  <div key={achievement.id} className={styles.achievementItem}>
                    <div className={styles.achievementDetails}>
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No category achievements yet. Start taking quizzes to earn them!</p>
          )}
        </div>
      </div>

        {userQuizHistory.length > 0 && (
        <div className={styles.quizHistorySection}>
          <h3>Recent Quiz History</h3>
          <div className={styles.quizHistoryList}>
          {userQuizHistory.slice(0, 5).map((quiz, index) => (
            <div key={index} className={styles.quizHistoryItem}>
            <span>{quiz.quizName}</span>
            <span>Score: {quiz.score}%</span>
            <span>{new Date(quiz.timestamp).toLocaleDateString()}</span>
            </div>
          ))}
          </div>
        </div>
        )}
      </div>
    </div>
    );
};

export default Profile;
