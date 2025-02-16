import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizCategories } from '../data/quizConfig';
import { quizData } from '../data/quizData';
import styles from '../styles/QuizCategories.module.css';
import { showToast } from './Toast';
import { useTheme } from '../contexts/ThemeContext';
import { FaBook, FaGlobe, FaHistory, FaQuestion, FaStar, FaStarHalf, FaRegStar, FaFlask, FaCode, FaFire } from 'react-icons/fa';

const QuizCategories = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  useEffect(() => {
    console.log('Quiz Categories:', quizCategories);
    console.log('Quiz Data:', quizData);
  }, []);




  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedDifficulty(null);
    showToast.info(`Selected Category: ${category.name}`);
  };

  const handleDifficultySelect = (difficulty) => {
    console.log('Selected difficulty:', difficulty);
    // Ensure all values are of correct type
    const difficultyConfig = {
      id: String(difficulty.id),
      name: String(difficulty.name),
      timeLimit: Number(difficulty.timeLimit),
      passingScore: Number(difficulty.passingScore),
      questionCount: Number(difficulty.questionCount)
    };

    // Validate the configuration
    if (isNaN(difficultyConfig.timeLimit) || 
        isNaN(difficultyConfig.passingScore) || 
        isNaN(difficultyConfig.questionCount)) {
      showToast.error('Invalid difficulty configuration');
      return;
    }

    setSelectedDifficulty(difficultyConfig);
    showToast.info(`Selected Difficulty: ${difficulty.name}`);
  };

  const startQuiz = async () => {
    if (!selectedCategory?.id || !selectedCategory?.name) {
      showToast.error('Please select a valid category');
      return;
    }

    if (!selectedDifficulty?.id || !selectedDifficulty?.name || 
        typeof selectedDifficulty?.timeLimit !== 'number' || 
        typeof selectedDifficulty?.passingScore !== 'number' || 
        typeof selectedDifficulty?.questionCount !== 'number') {
      showToast.error('Please select a valid difficulty');
      return;
    }

    try {
      console.log('Selected category:', selectedCategory);
      console.log('Quiz data categories:', quizData.categories);
      const categoryData = quizData.categories.find(cat => cat.id === selectedCategory.id);
      console.log('Found category data:', categoryData);
      
      if (!categoryData) {
        showToast.error('Category data not found');
        return;
      }

      const questions = categoryData.questions[selectedDifficulty.id.toLowerCase()];
      console.log('Questions for difficulty:', questions);
      
      if (!Array.isArray(questions) || questions.length === 0) {
        showToast.error(`No questions available for ${selectedDifficulty.name} difficulty`);
        return;
      }

      // Validate each question
      if (!questions.every(q => q.question && Array.isArray(q.options) && q.correctAnswer)) {
        showToast.error('Invalid question format detected');
        return;
      }

      // Shuffle questions and limit based on difficulty
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
      const limitedQuestions = shuffledQuestions.slice(0, selectedDifficulty.questionCount);

      const quizState = {
        category: {
          id: String(selectedCategory.id),
          name: String(selectedCategory.name)
        },
        difficulty: selectedDifficulty,
        questions: limitedQuestions
      };

      console.log('Starting quiz with state:', quizState);
      navigate('/quiz', { state: quizState });
    } catch (error) {
      console.error('Error loading quiz data:', error);
      showToast.error('Failed to load quiz data');
    }
  };



  const getDifficultyIcon = (difficultyName) => {
    switch(difficultyName.toLowerCase()) {
      case 'easy':
        return <FaRegStar className={styles.difficultyIcon} />;
      case 'medium':
        return <FaStarHalf className={styles.difficultyIcon} />;
      case 'hard':
        return <FaStar className={styles.difficultyIcon} />;
      default:
        return <FaQuestion className={styles.difficultyIcon} />;
    }
  };

  const getCategoryIcon = (categoryId) => {
    switch(categoryId) {
      case 'world_history':
        return <FaHistory className={styles.categoryIcon} />;
      case 'science':
        return <FaFlask className={styles.categoryIcon} />;
      case 'pakistan':
        return <FaGlobe className={styles.categoryIcon} />;
      case 'programming':
        return <FaCode className={styles.categoryIcon} />;
      default:
        return <FaQuestion className={styles.categoryIcon} />;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`${styles.categoriesContainer} ${isDark ? styles.dark : ''}`}>
      <h1>Choose Your Quiz Category</h1>
      
      <div className={styles.categoriesGrid}>
        {quizCategories.map((category) => (
          <div 
            key={category.id}
            className={`${styles.categoryCard} ${selectedCategory?.id === category.id ? styles.selected : ''} ${isDark ? styles.dark : ''}`}
            onClick={() => handleCategorySelect(category)}
            >
            <div className={styles.categoryIconWrapper}>
              {getCategoryIcon(category.id)}
              {category.isHot && (
              <div className={styles.hotLabel}>
                <FaFire className={styles.hotIcon} />
                HOT
              </div>
              )}
            </div>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            </div>

        ))}
      </div>

      {selectedCategory && (
        <div className={styles.difficultySection}>
          <h2>Select Difficulty Level</h2>
          <div className={styles.difficultyGrid}>
            {selectedCategory.difficulties.map((difficulty) => (
                  <div 
                  key={difficulty.id}
                  className={`${styles.difficultyCard} ${selectedDifficulty?.id === difficulty.id ? styles.selected : ''} ${isDark ? styles.dark : ''}`}
                  onClick={() => handleDifficultySelect(difficulty)}
                  >
                  <div className={styles.difficultyIconWrapper}>
                    {getDifficultyIcon(difficulty.name)}
                  </div>
                  <h3>{difficulty.name}</h3>
                  <p>Questions: {difficulty.questionCount}</p>
                  <p>Time Limit: {Math.floor(difficulty.timeLimit / 60)} minutes</p>
                  <p>Passing Score: {difficulty.passingScore}%</p>
                  </div>

            ))}
          </div>
        </div>
      )}

      {selectedCategory && selectedDifficulty && (
        <button 
          className={`${styles.startQuizButton} ${isDark ? styles.dark : ''}`}
          onClick={startQuiz}
        >

          Start {selectedCategory.name} Quiz
          <span className={styles.buttonArrow}>→</span>
        </button>
      )}
    </div>
  );
};

export default QuizCategories;