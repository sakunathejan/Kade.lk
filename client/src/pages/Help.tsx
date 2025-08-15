import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    { id: 'general', label: 'General', icon: '📋' },
    { id: 'account', label: 'Account & Orders', icon: '👤' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: '🚚' },
    { id: 'returns', label: 'Returns & Refunds', icon: '↩️' },
    { id: 'payment', label: 'Payment & Billing', icon: '💳' },
    { id: 'technical', label: 'Technical Support', icon: '🔧' }
  ];

  const faqs = {
    general: [
      {
        question: "What is TaproBuy?",
        answer: "TaproBuy is an e-commerce platform that offers a wide variety of products across multiple categories including electronics, clothing, books, home & garden, and sports & outdoors. We focus on providing quality products with excellent customer service."
      },
      {
        question: "How do I create an account?",
        answer: "Creating an account is easy! Click on the 'Register' button in the header, fill in your details including name, email, and password, and you'll be all set to start shopping."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent."
      }
    ],
    account: [
      {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you'll receive a tracking number via email. You can also log into your account and view your order history and tracking information in the 'My Orders' section."
      },
      {
        question: "Can I change or cancel my order?",
        answer: "Orders can be modified or cancelled within 1 hour of placement, as long as they haven't been processed for shipping. Contact our customer service team immediately if you need to make changes."
      },
      {
        question: "How do I update my account information?",
        answer: "Log into your account and go to 'Account Settings' where you can update your personal information, shipping addresses, and payment methods."
      }
    ],
    shipping: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-5 business days. Express shipping (1-2 business days) and overnight shipping are also available for select items. Shipping times may vary based on your location."
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we ship to most countries worldwide. International shipping times vary by location and can take 7-21 business days. Additional customs fees may apply."
      },
      {
        question: "What shipping options are available?",
        answer: "We offer standard, express, and overnight shipping options. Free shipping is available on orders over $50. You can select your preferred shipping method during checkout."
      }
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for most items. Products must be in their original condition with all packaging intact. Some items like electronics and software may have different return terms."
      },
      {
        question: "How do I return an item?",
        answer: "To return an item, log into your account, go to 'My Orders', select the order containing the item you want to return, and follow the return process. You'll receive a return label to print."
      },
      {
        question: "When will I receive my refund?",
        answer: "Refunds are typically processed within 3-5 business days after we receive your return. The time it takes for the refund to appear in your account depends on your payment method and bank."
      }
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our payment partners."
      },
      {
        question: "Is it safe to pay online?",
        answer: "Yes, all payments are processed through secure, encrypted connections. We use industry-standard SSL encryption and never store your full credit card information on our servers."
      },
      {
        question: "Do you offer payment plans?",
        answer: "Yes, we offer flexible payment plans through our partner services. You can split your purchase into monthly payments with 0% interest on qualifying orders."
      }
    ],
    technical: [
      {
        question: "The website is not loading properly. What should I do?",
        answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our technical support team with details about your device and browser."
      },
      {
        question: "I can't log into my account. What's wrong?",
        answer: "First, make sure you're using the correct email and password. If you've forgotten your password, use the 'Forgot Password' link to reset it. Check that Caps Lock is off and try again."
      },
      {
        question: "The mobile app is not working. How can I fix it?",
        answer: "Try updating the app to the latest version, restarting your device, or reinstalling the app. If issues continue, contact our mobile support team with your device model and OS version."
      }
    ]
  };

  const filteredFaqs = faqs[activeCategory as keyof typeof faqs] || [];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl mb-6"
            >
              ❓
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Help Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            >
              Find answers to common questions, get support, and learn how to make the most of TaproBuy
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg text-gray-900 rounded-2xl border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
                />
                <button className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Categories and FAQ Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Category Tabs */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === `${activeCategory}-${index}` ? null : `${activeCategory}-${index}`)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      expandedFaq === `${activeCategory}-${index}` ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedFaq === `${activeCategory}-${index}` && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Contact Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our support team is here to help you with any questions or concerns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📧',
                title: 'Email Support',
                description: 'Get a response within 24 hours',
                action: 'support@taprobuy.com',
                link: 'mailto:support@taprobuy.com'
              },
              {
                icon: '💬',
                title: 'Live Chat',
                description: 'Chat with our support team',
                action: 'Start Chat',
                link: '#'
              },
              {
                icon: '📞',
                title: 'Phone Support',
                description: 'Call us during business hours',
                action: '+1 (555) 123-4567',
                link: 'tel:+15551234567'
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{contact.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {contact.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {contact.description}
                </p>
                <a
                  href={contact.link}
                  className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  {contact.action}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find what you need faster with these helpful resources
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Order Status', link: '/orders', icon: '📦' },
              { label: 'Return Policy', link: '/returns', icon: '↩️' },
              { label: 'Shipping Info', link: '/shipping', icon: '🚚' },
              { label: 'Size Guide', link: '/size-guide', icon: '📏' },
              { label: 'Privacy Policy', link: '/privacy', icon: '🔒' },
              { label: 'Terms of Service', link: '/terms', icon: '📄' },
              { label: 'Contact Us', link: '/contact', icon: '📞' },
              { label: 'About Us', link: '/about', icon: 'ℹ️' }
            ].map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.05, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Link
                  to={link.link}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-3xl mb-3">{link.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {link.label}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Help;
