import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import styles from './Contact.module.css';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setErrors({});

      try {
        // Simulated API call - replace with actual submission logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ submit: 'Failed to submit. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <Navbar />
      <div className={styles.contactWrapper}>
        <div className={styles.contactInfo}>
          <h2>Contact Information</h2>
          <p>Have questions or feedback? We'd love to hear from you!</p>
          
          <div className={styles.contactDetails}>
            <div>
              <FaEnvelope />
              Hanzalahtahir92@gmail.com
            </div>
            <div>
              <FaPhoneAlt />
              +92 301 8544514
            </div>
            <div>
              <FaMapMarkerAlt />
            kharader,karachi,pakistan
            </div>
          </div>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2>Send us a Message</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              error={errors.name}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <div id="name-error" className={styles.errorMessage}>{errors.name}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              error={errors.email}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <div id="email-error" className={styles.errorMessage}>{errors.email}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className={`${styles.input} ${errors.message ? styles.inputError : ''}`}
              error={errors.message}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <div id="message-error" className={styles.errorMessage}>{errors.message}</div>}
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitSuccess && (
            <div className={styles.successMessage}>
              Thank you! Your message has been sent successfully.
            </div>
          )}
          {errors.submit && (
            <div className={styles.errorMessage}>{errors.submit}</div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
