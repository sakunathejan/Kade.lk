import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const subjects = [
    'General Inquiry',
    'Order Support',
    'Technical Issue',
    'Product Question',
    'Returns & Refunds',
    'Partnership',
    'Feedback',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl mb-6"
            >
              📞
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            >
              We'd love to hear from you! Whether you have a question, need support, 
              or want to share feedback, our team is here to help.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Contact Form and Info Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Send us a Message
            </h2>
            
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
              >
                ✅ Thank you for your message! We'll get back to you within 24 hours.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Message...
                  </div>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Contact Information
            </h2>
            
            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Main: +1 (555) 123-4567
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Sales: +1 (555) 123-4568
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Monday - Friday: 9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Email Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    General: info@taprobuy.com
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Support: support@taprobuy.com
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Response within 24 hours
                  </p>
                </div>
              </div>

              {/* Live Chat */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Available on our website
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Monday - Friday: 9:00 AM - 8:00 PM EST
                  </p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Office Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    123 Commerce Street
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    Suite 456, Business District
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    New York, NY 10001, USA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Office Locations Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Global Offices
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We have offices around the world to serve you better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: 'New York',
                country: 'United States',
                address: '123 Commerce Street, Suite 456, NY 10001',
                phone: '+1 (555) 123-4567',
                email: 'nyc@taprobuy.com',
                timezone: 'EST (UTC-5)',
                icon: '🗽'
              },
              {
                city: 'London',
                country: 'United Kingdom',
                address: '456 Business Avenue, London EC1A 1BB',
                phone: '+44 20 1234 5678',
                email: 'london@taprobuy.com',
                timezone: 'GMT (UTC+0)',
                icon: '🇬🇧'
              },
              {
                city: 'Tokyo',
                country: 'Japan',
                address: '789 Innovation Road, Tokyo 100-0001',
                phone: '+81 3 1234 5678',
                email: 'tokyo@taprobuy.com',
                timezone: 'JST (UTC+9)',
                icon: '🗾'
              }
            ].map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{office.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {office.city}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {office.country}
                  </p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    📍 {office.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    📞 {office.phone}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    📧 {office.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    🕐 {office.timezone}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Quick answers to common questions about contacting us
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "What's the best way to get a quick response?",
                answer: "For immediate assistance, we recommend using our live chat feature during business hours. For non-urgent matters, email support typically responds within 24 hours."
              },
              {
                question: "Can I schedule a call with your team?",
                answer: "Yes! You can request a scheduled call by emailing us at support@taprobuy.com with your preferred time and topic. We'll get back to you within 24 hours to confirm."
              },
              {
                question: "Do you offer support in multiple languages?",
                answer: "Currently, we provide support in English, Spanish, and French. We're working on adding more languages to better serve our global customer base."
              },
              {
                question: "What information should I include in my message?",
                answer: "Please include your order number (if applicable), a clear description of your issue or question, and any relevant screenshots or attachments that might help us assist you better."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
