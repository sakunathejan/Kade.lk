import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  media?: Array<{ url: string; type: string }>;
  images?: Array<{ url: string }>;
}

const Deals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const handleAddToCart = (product: Product) => {
    // Handle add to cart functionality
    console.log('Adding to cart:', product);
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // In a real app, this would fetch from your API with deals/discounts
        const response = await fetch('/api/products/deals');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          // Fallback to sample data
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Countdown timer for deals
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endDate = new Date('2024-12-31T23:59:59').getTime();
      const distance = endDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const filters = [
    { value: 'all', label: 'All Deals' },
    { value: 'flash', label: 'Flash Sales' },
    { value: 'clearance', label: 'Clearance' },
    { value: 'bogo', label: 'Buy One Get One' },
    { value: 'percentage', label: 'Percentage Off' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20">
      {/* Hero Section with Countdown */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl mb-6"
            >
              🔥
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Hot Deals & Offers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            >
              Limited time offers that you won't want to miss! 
              Shop now before these incredible deals disappear.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto"
            >
              <p className="text-lg font-medium mb-4">Deals End In:</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((unit, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white/30 rounded-lg p-3">
                      <div className="text-3xl font-bold">{unit.value.toString().padStart(2, '0')}</div>
                      <div className="text-sm opacity-80">{unit.label}</div>
                    </div>
                  </div>
                ))}
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

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          {filters.map((filterOption) => (
            <motion.button
              key={filterOption.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                filter === filterOption.value
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {filterOption.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id || index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {/* Deal Badge */}
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                    {Math.floor(Math.random() * 50) + 30}% OFF
                  </div>
                </div>

                {/* Flash Sale Badge */}
                {Math.random() > 0.7 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
                      ⚡ FLASH
                    </div>
                  </div>
                )}

                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Active Deals
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back soon for amazing deals and discounts!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Special Offers Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              More Ways to Save
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Take advantage of these additional savings opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎁',
                title: 'First Order Discount',
                description: 'Get 15% off your first purchase with code WELCOME15',
                code: 'WELCOME15'
              },
              {
                icon: '📱',
                title: 'Mobile App Exclusive',
                description: 'Download our app for exclusive mobile-only deals',
                code: 'MOBILE20'
              },
              {
                icon: '📧',
                title: 'Newsletter Subscribers',
                description: 'Subscribe to get early access to sales and special offers',
                code: 'NEWS10'
              }
            ].map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{offer.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {offer.description}
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <code className="text-primary font-mono font-bold">{offer.code}</code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Never Miss a Deal Again!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our deals newsletter and be the first to know about flash sales, 
            clearance events, and exclusive offers!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 text-gray-900"
            />
            <button className="px-6 py-3 bg-white text-red-500 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Deals;
