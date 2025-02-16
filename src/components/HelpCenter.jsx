import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from './styles/HelpCenter.module.css';
import { FaBook, FaQuestionCircle, FaHeadset, FaEnvelope, FaClock, FaGraduationCap, FaClipboardList, FaTrophy } from 'react-icons/fa';

const HelpCenter = () => {
	const { theme } = useTheme();

	return (
		<div className={`${styles.helpCenterContainer} ${theme === 'light' ? styles.light : ''}`}>
			<div className={styles.header}>
				<FaHeadset size={40} className={styles.headerIcon} />
				<h1>Help Center</h1>
				<p>Find answers to common questions and get support</p>
			</div>

			<div className={styles.content}>
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<FaBook className={styles.sectionIcon} />
						<h2>Quick Start Guide</h2>
					</div>
					<div className={styles.guideList}>
						<div className={styles.guideItem}>
							<FaGraduationCap className={styles.guideIcon} />
							<h3>1. Getting Started</h3>
							<p>Create an account or log in to start taking quizzes and tracking your progress.</p>
						</div>
						<div className={styles.guideItem}>
							<FaClipboardList className={styles.guideIcon} />
							<h3>2. Choose a Quiz</h3>
							<p>Select from various categories including General Knowledge, Science, History, and more.</p>
						</div>
						<div className={styles.guideItem}>
							<FaTrophy className={styles.guideIcon} />
							<h3>3. Track Progress</h3>
							<p>View your scores, achievements, and performance statistics in your profile.</p>
						</div>
					</div>
				</section>

				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<FaQuestionCircle className={styles.sectionIcon} />
						<h2>Common Issues</h2>
					</div>
					<div className={styles.faqList}>
						<details className={styles.faqItem}>
							<summary>How do I reset my password?</summary>
							<p>Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
						</details>
						<details className={styles.faqItem}>
							<summary>Why can't I see my quiz results?</summary>
							<p>Make sure you're logged in and have completed at least one quiz. Results appear in your profile section.</p>
						</details>
						<details className={styles.faqItem}>
							<summary>How are achievements earned?</summary>
							<p>Achievements are awarded based on your quiz performance, completion rates, and specific milestones.</p>
						</details>
					</div>
				</section>

				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<FaHeadset className={styles.sectionIcon} />
						<h2>Contact Support</h2>
					</div>
					<div className={styles.supportInfo}>
						<p>Need additional help? Our support team is here for you.</p>
						<div className={styles.contactMethods}>
							<div className={styles.contactItem}>
								<FaEnvelope className={styles.contactIcon} />
								<h3>Email Support</h3>
								<p>tahiralmadni@gmail.com</p>
							</div>
							<div className={styles.contactItem}>
								<FaClock className={styles.contactIcon} />
								<h3>Response Time</h3>
								<p>Within 24 hours</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default HelpCenter;