import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { showToast } from './Toast';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './QuizContainer.module.css';

const QuizContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [quizConfig, setQuizConfig] = useState(null);
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [progress, setProgress] = useState(0);




  const finishQuiz = useCallback(async () => {
    const currentQuizConfig = quizConfig;
    const currentQuestions = questions;
    const currentScore = score;
    const currentTimeRemaining = timeRemaining;

    if (!currentQuizConfig?.difficulty || !currentQuizConfig?.category || !Array.isArray(currentQuestions) || currentQuestions.length === 0) {
      console.error('Quiz configuration is invalid:', {
        quizConfig: currentQuizConfig,
        questionsLength: currentQuestions?.length
      });
      showToast.error('Error: Quiz configuration is invalid');
      navigate('/quiz-categories');
      return;
    }

    setIsQuizFinished(true);
    const percentage = Math.round((currentScore / currentQuestions.length) * 100);
    const isPassed = percentage >= currentQuizConfig.difficulty.passingScore;

    try {
      if (auth.currentUser) {
        await addDoc(collection(db, 'quizResults'), {
          userId: auth.currentUser.uid,
          category: currentQuizConfig.category.name,
          difficulty: currentQuizConfig.difficulty.name,
          score: percentage,
          isPassed,
          timeSpent: currentQuizConfig.difficulty.timeLimit - currentTimeRemaining,
          timestamp: new Date().toISOString()
        });
      }

        navigate('/results', {
        state: {
          category: currentQuizConfig.category.name,
          difficulty: currentQuizConfig.difficulty.name,
          score: currentScore,
          total: currentQuestions.length,
          percentage,
          isPassed,
          timeSpent: currentQuizConfig.difficulty.timeLimit - currentTimeRemaining
        }
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
      showToast.error('Failed to save quiz result');
    }
  }, [quizConfig, questions, score, timeRemaining, navigate, auth, showToast]);

  const handleNextQuestion = useCallback(() => {
    if (!questions[currentQuestionIndex]) {
      console.error('Invalid question index:', currentQuestionIndex);
      return;
    }

    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => {
      const nextIndex = prev + 1;
      // Calculate progress based on completed questions (including current)
      const completedQuestions = nextIndex;
      const progressPercentage = (completedQuestions / questions.length) * 100;
      setProgress(progressPercentage);
      setSelectedAnswer(null);
      return nextIndex;
      });
    } else {
      // Set progress to 100% before finishing
      setProgress(100);
      finishQuiz();
    }
  }, [currentQuestionIndex, questions, selectedAnswer, finishQuiz]);

  const handleAnswerSelect = useCallback((answer) => {
    setSelectedAnswer(answer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const validateQuizData = (data) => {
      if (!data?.category?.id || !data?.category?.name) {
        throw new Error('Invalid category configuration');
      }

      if (!data?.difficulty?.id || !data?.difficulty?.name || 
          typeof data?.difficulty?.timeLimit !== 'number' || 
          typeof data?.difficulty?.passingScore !== 'number' || 
          typeof data?.difficulty?.questionCount !== 'number') {
        throw new Error('Invalid difficulty configuration');
      }

      if (!Array.isArray(data?.questions) || data?.questions.length === 0 || 
          !data.questions.every(q => q.question && Array.isArray(q.options) && q.correctAnswer)) {
        throw new Error('Invalid questions configuration');
      }

      return true;
    };

    const initializeQuiz = async () => {
      try {
        if (!location.state) {
          throw new Error('No quiz data found');
        }

        const quizData = location.state;
        validateQuizData(quizData);

        if (mounted) {
          // Initialize all state in a batch
          const { category, difficulty, questions } = quizData;
          setQuizConfig({ category, difficulty });
          setCategory(category);
          setDifficulty(difficulty);
          setQuestions(questions);
          setTimeRemaining(difficulty.timeLimit);
          setProgress(0);
          setCurrentQuestionIndex(0);
          setScore(0);
          setSelectedAnswer(null);
          setIsQuizFinished(false);
        }
      } catch (error) {
        console.error('Quiz initialization error:', error.message);
        showToast.error(error.message);
        navigate('/quiz-categories');
      }
    };

    initializeQuiz();
    return () => { mounted = false; };
  }, [location.state, navigate, showToast]);

  useEffect(() => {
    let timerRef = null;
    
    if (timeRemaining > 0 && !isQuizFinished) {
      timerRef = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime === 0 && !isQuizFinished) {
            finishQuiz();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef) {
        clearTimeout(timerRef);
      }
    };
  }, [timeRemaining, isQuizFinished, finishQuiz]);


  if (!category || !difficulty || questions.length === 0) {
    return <div className={styles.loading}>Loading quiz...</div>;
  }

  return (
    <div className={`${styles.quizContainer} ${styles[theme]}`}>
      <div className={styles.quizHeader}>
        <h2>{category.name} Quiz - {difficulty.name}</h2>
        <div className={styles.quizInfo}>
            <div className={styles.progressCircle} style={{'--progress': `${progress}%`}}>
            <span>{Math.round(progress)}%</span>
            </div>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

            {!isQuizFinished && questions[currentQuestionIndex] && (
            <div className={styles.questionContainer}>
              <div className={styles.questionText}>
              <h3>{questions[currentQuestionIndex].question}</h3>
              </div>
              <div className={styles.optionsGrid}>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                key={index}
                className={`${styles.optionButton} ${selectedAnswer === option ? styles.selected : ''}`}
                onClick={() => handleAnswerSelect(option)}
                >
                {option}
                </button>
              ))}
              </div>
              <button
              className={styles.nextButton}
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
            )}
    </div>
  );
};

export default QuizContainer;
