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

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [category, setCategory] = useState('all');

  const handleAddToCart = (product: Product) => {
    // Handle add to cart functionality
    console.log('Adding to cart:', product);
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // In a real app, this would fetch from your API with sales metrics
        const response = await fetch(`/api/products/bestsellers?timeframe=${timeframe}&category=${category}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          // Fallback to sample data
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [timeframe, category]);

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

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl mb-6"
            >
              🏆
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Best Sellers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Discover the most popular and top-selling products that our customers love. 
              These are the items that consistently deliver quality and satisfaction.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Time Period
              </label>
              <div className="flex flex-wrap gap-2">
                {timeframes.map((tf) => (
                  <motion.button
                    key={tf.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeframe(tf.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      timeframe === tf.value
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tf.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      category === cat.value
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Grid with Rankings */}
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
                {/* Ranking Badge */}
                <div className="absolute -top-2 -left-2 z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                    'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}>
                    #{index + 1}
                  </div>
                </div>
                
                {/* Sales Metrics */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    🔥 Hot
                  </div>
                </div>

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
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Best Sellers Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sales data is being collected. Check back soon for trending products!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why These Products Are Popular
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our best sellers are chosen based on customer satisfaction, sales volume, and quality ratings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '⭐',
                title: 'High Ratings',
                description: 'Consistently rated 4.5+ stars by thousands of customers'
              },
              {
                icon: '🚀',
                title: 'Fast Shipping',
                description: 'Quick delivery and excellent customer service'
              },
              {
                icon: '💎',
                title: 'Quality Assured',
                description: 'Rigorous quality checks and customer satisfaction guarantee'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {stat.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BestSellers;
