import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './styles/QuestionCard.module.css';

const QuestionCard = () => {
  const { quizState, handleAnswerSubmit } = useOutletContext();
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quizState.quizData.questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.quizData.questions.length) * 100;

  // Reset state when question changes
  useEffect(() => {
    setTimeLeft(30);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [quizState.currentQuestionIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            handleAnswerSubmit(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleAnswerSubmit, isAnswered, quizState.currentQuestionIndex]);

  const handleOptionClick = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
      setIsAnswered(true);
      setTimeout(() => {
        handleAnswerSubmit(option);
      }, 500); // Add small delay to show selection
    }
  };

  return (
    <div className={styles.questionCard}>
      <div className={styles.timer}>
        Time Remaining: {timeLeft}s
        <div className={styles.timerBar} style={{ width: `${(timeLeft / 30) * 100}%` }} />
      </div>

      <div className={styles.questionInfo}>
        Question {quizState.currentQuestionIndex + 1} of {quizState.quizData.questions.length}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <h2 className={styles.question}>{currentQuestion.question}</h2>

      <div className={styles.optionsGrid}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`${styles.option} ${
              selectedOption === option ? styles.selected : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;