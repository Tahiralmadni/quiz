import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './FAQ.module.css';
import Navbar from './Navbar';
import Footer from './Footer';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How do I start a quiz?",
      answer: "Navigate to the Quiz Categories page, select a category and difficulty level, then click 'Start Quiz' to begin. You can choose from various subjects and test your knowledge."
    },
    {
      question: "Can I retake a quiz?",
      answer: "Absolutely! You can retake quizzes as many times as you want. Your latest score will be saved in your profile, allowing you to track your progress and improve over time."
    },
    {
      question: "Are there time limits for quizzes?",
      answer: "Each quiz has a 10-minute time limit. If you don't complete the quiz within this time, it will automatically end. This ensures fair testing and keeps the quiz engaging."
    },
    {
      question: "How are quiz scores calculated?",
      answer: "Scores are calculated based on the number of correct answers. The percentage is displayed at the end of each quiz. Correct answers earn you points, and your total score reflects your performance."
    },
    {
      question: "Can I track my quiz history?",
      answer: "Yes, your quiz attempts and scores are saved in your profile. You can view your performance history, see your progress over time, and identify areas where you can improve."
    },
    {
      question: "Are the quizzes free?",
      answer: "Most quizzes are completely free! We offer a wide range of quizzes across different categories. Some specialized or advanced quizzes might require a premium subscription."
    },
    {
      question: "How often are new quizzes added?",
      answer: "We continuously update our quiz database with new and exciting content. New quizzes are added weekly across various categories, ensuring you always have fresh challenges to tackle."
    },
    {
      question: "Can I create my own quiz?",
      answer: "Currently, we don't support user-created quizzes. However, we're working on a feature that will allow users to create and share their own quizzes in the future."
    },
    {
      question: "Do I need an account to take quizzes?",
      answer: "While you can browse quizzes without an account, creating a free account allows you to save your progress, track scores, and access personalized recommendations."
    },
    {
      question: "What subjects are available?",
      answer: "We offer quizzes across multiple subjects including Science, History, Geography, Literature, Mathematics, Technology, Sports, and more. New subjects are regularly added."
    },
    {
      question: "Are there difficulty levels?",
      answer: "Yes! Our quizzes come in three difficulty levels: Beginner, Intermediate, and Advanced. This allows learners of all skill levels to find appropriate challenges."
    },
    {
      question: "Can I compete with friends?",
      answer: "We're developing a social feature that will allow you to challenge friends, compare scores, and create friendly competitions. Stay tuned for updates!"
    },
    {
      question: "Is there a mobile app?",
      answer: "Our web platform is fully responsive and works great on mobile devices. A dedicated mobile app is currently in development and will be released soon."
    },
    {
      question: "How secure is my data?",
      answer: "We take data privacy seriously. All personal information is encrypted, and we follow strict data protection guidelines. We never sell or share your personal information."
    },
    {
      question: "What browsers are supported?",
      answer: "Our platform works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated to the latest version."
    },
    {
      question: "Do you offer certificates?",
      answer: "We provide digital certificates for completed quiz series and achievement milestones. These can be downloaded and shared on professional networks."
    },
    {
      question: "Are there timed practice sessions?",
      answer: "Yes! We offer timed practice sessions that simulate real exam conditions. These help you improve your speed and accuracy under time pressure."
    },
    {
      question: "Can I download quiz results?",
      answer: "You can download and save your quiz results as PDF or export them to your profile. This helps you maintain a record of your learning journey."
    },
    {
      question: "Do you have multilingual support?",
      answer: "Currently, our platform supports English. We are working on adding more languages to make learning accessible to a global audience."
    },
    {
      question: "How can I provide feedback?",
      answer: "We welcome user feedback! You can submit suggestions, report issues, or share your experience through the 'Feedback' section in your profile settings."
    },
    {
      question: "Are there parental controls?",
      answer: "We're developing robust parental control features to help parents monitor and manage their children's quiz activities and learning progress."
    },
    {
      question: "What makes your quizzes unique?",
      answer: "Our quizzes are carefully curated by experts, designed to be educational, engaging, and fun. We focus on providing learning experiences, not just tests."
    },
    {
      question: "Do you offer adaptive learning?",
      answer: "Our platform uses intelligent algorithms to recommend quizzes based on your performance and learning style, creating a personalized learning path."
    },
    {
      question: "Can I print quiz materials?",
      answer: "We provide printable study guides and quiz summaries. These can be downloaded and used for offline study and reference."
    },
    {
      question: "Are there group learning options?",
      answer: "We're developing collaborative learning features that will allow study groups, team challenges, and shared learning experiences."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <Navbar />
      <div className={styles.faqContent}>
        <div className={styles.faqHeader}>
          <h1>Frequently Asked Questions</h1>
        </div>
        <div className={styles.faqScrollContainer}>
          <div className={styles.faqList}>
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
              >
                <div 
                  className={styles.faqQuestion} 
                  onClick={() => toggleFAQ(index)}
                >
                  <h3>{faq.question}</h3>
                  <FaChevronDown className={styles.toggleIcon} />
                </div>
                {activeIndex === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
