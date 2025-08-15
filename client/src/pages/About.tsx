import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
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

  const stats = [
    { number: '1M+', label: 'Happy Customers', icon: '😊' },
    { number: '50K+', label: 'Products Sold', icon: '📦' },
    { number: '150+', label: 'Countries Served', icon: '🌍' },
    { number: '99.9%', label: 'Uptime', icon: '⚡' }
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring their satisfaction is our top priority.'
    },
    {
      icon: '💎',
      title: 'Quality Assured',
      description: 'Every product we offer meets our strict quality standards, giving you confidence in your purchases.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We continuously innovate our platform and services to provide the best shopping experience possible.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'We\'re committed to reducing our environmental impact and promoting sustainable business practices.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '👩‍💼',
      bio: 'Former e-commerce executive with 15+ years of experience in digital retail and customer experience.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: '👨‍💻',
      bio: 'Technology leader with expertise in scalable platforms, AI, and cutting-edge e-commerce solutions.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      image: '👩‍🔧',
      bio: 'Operations specialist focused on streamlining processes and ensuring seamless customer experiences.'
    },
    {
      name: 'David Kim',
      role: 'Head of Marketing',
      image: '👨‍💼',
      bio: 'Marketing strategist with a passion for building brand awareness and customer engagement.'
    }
  ];

  const timeline = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'TaproBuy was born from a vision to create a seamless online shopping experience.'
    },
    {
      year: '2019',
      title: 'First 10,000 Customers',
      description: 'Reached our first major milestone with 10,000 satisfied customers.'
    },
    {
      year: '2020',
      title: 'International Expansion',
      description: 'Expanded our services to serve customers in over 50 countries worldwide.'
    },
    {
      year: '2021',
      title: 'Mobile App Launch',
      description: 'Launched our mobile app to provide shopping convenience on the go.'
    },
    {
      year: '2022',
      title: 'AI-Powered Recommendations',
      description: 'Implemented advanced AI technology for personalized product recommendations.'
    },
    {
      year: '2023',
      title: '1 Million Customers',
      description: 'Celebrated reaching 1 million happy customers across the globe.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl mb-6"
            >
              🏢
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              About TaproBuy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            >
              We're on a mission to make online shopping simple, enjoyable, and accessible to everyone. 
              Learn more about our story, values, and the team behind TaproBuy.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Our Story Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              TaproBuy was founded in 2018 with a simple yet powerful vision: to create an online shopping 
              experience that puts customers first. What started as a small startup has grown into a trusted 
              e-commerce platform serving millions of customers worldwide.
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={itemVariants} className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
            
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col text-center md:text-left`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:relative w-4 h-4 bg-purple-500 rounded-full border-4 border-white dark:border-gray-800 z-10"></div>
                  
                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} mt-4 md:mt-0`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-purple-500 mb-2">
                        {event.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core values guide everything we do and shape the way we serve our customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate individuals who make TaproBuy possible
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-purple-500 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the TaproBuy Family
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the difference that customer-first e-commerce makes. 
            Start shopping with us today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Shopping
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
