import { useOutletContext } from 'react-router-dom';
import styles from './styles/Option.module.css';

const Option = () => {
  const { quizState, handleAnswerSubmit } = useOutletContext();
  const currentQuestion = quizState.quizData.questions[quizState.currentQuestionIndex];

  return (
    <div className={styles.optionContainer}>
      <div className={styles.question}>
        {currentQuestion.question}
      </div>
      <div className={styles.options}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={styles.optionButton}
            onClick={() => handleAnswerSubmit(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Option;