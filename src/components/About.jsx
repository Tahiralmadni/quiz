import React from 'react';
import styles from './About.module.css';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <Navbar />
      <div className={styles.aboutContent}>
        <h1>Welcome to QuizMaster</h1>
        
        <section className={styles.missionSection}>
          <h2>Our Vision & Mission</h2>
          <p>QuizMaster is revolutionizing the way people learn and test their knowledge. We believe that learning should be engaging, interactive, and accessible to everyone. Our platform combines cutting-edge technology with expertly crafted questions to create an immersive learning experience.</p>
        </section>
        
        <section className={styles.featuresSection}>
          <h2>Comprehensive Learning Experience</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🌍</span>
              <h3>World History</h3>
              <p>Explore the rich tapestry of human civilization, from ancient empires to modern revolutions. Test your knowledge about significant events, influential leaders, and cultural transformations.</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <h3>Science & Technology</h3>
              <p>Dive into the fascinating world of scientific discoveries, technological innovations, and natural phenomena. Challenge yourself with questions ranging from basic concepts to complex theories.</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💻</span>
              <h3>Programming</h3>
              <p>Master the fundamentals of coding with our comprehensive programming quizzes. Perfect for both beginners and experienced developers looking to sharpen their skills.</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎨</span>
              <h3>Interactive Learning</h3>
              <p>Experience education through engaging quizzes, immediate feedback, and detailed explanations. Our platform adapts to your learning pace and style.</p>
            </div>
          </div>
        </section>
        
        <section className={styles.platformSection}>
          <h2>Platform Excellence</h2>
          <div className={styles.excellenceGrid}>
            <div className={styles.excellenceItem}>
              <h3>🎯 Adaptive Learning</h3>
              <p>Questions adjust to your skill level, ensuring optimal challenge and growth</p>
            </div>
            <div className={styles.excellenceItem}>
              <h3>📊 Progress Tracking</h3>
              <p>Detailed analytics and performance metrics to monitor your improvement</p>
            </div>
            <div className={styles.excellenceItem}>
              <h3>🏆 Achievement System</h3>
              <p>Earn badges and certificates as you master different topics</p>
            </div>
            <div className={styles.excellenceItem}>
              <h3>📱 Cross-Platform</h3>
              <p>Access your learning journey from any device, anywhere</p>
            </div>
          </div>
        </section>

        <section className={styles.methodologySection}>
          <h2>Our Learning Methodology</h2>
          <div className={styles.methodGrid}>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>📚</span>
              <h3>Structured Learning Paths</h3>
              <p>Carefully designed progression from fundamentals to advanced concepts</p>
            </div>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>🔄</span>
              <h3>Spaced Repetition</h3>
              <p>Optimized review intervals to enhance long-term retention</p>
            </div>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>🎯</span>
              <h3>Targeted Practice</h3>
              <p>Focus on areas that need improvement</p>
            </div>
          </div>
        </section>

        <section className={styles.futureSection}>
          <h2>Innovation Pipeline</h2>
          <p>We're committed to continuous improvement and innovation. Here's what's coming:</p>
          <div className={styles.futureGrid}>
            <div className={styles.futureItem}>
              <h3>🏆 Advanced Competition Modes</h3>
              <p>Real-time challenges and tournaments</p>
            </div>
            <div className={styles.futureItem}>
              <h3>🤝 Community Features</h3>
              <p>Collaborate and compete with learners worldwide</p>
            </div>
            <div className={styles.futureItem}>
              <h3>🎓 Expert-Led Content</h3>
              <p>Partnerships with leading educators and institutions</p>
            </div>
            <div className={styles.futureItem}>
              <h3>🌟 Enhanced Analytics</h3>
              <p>AI-powered learning insights and recommendations</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;