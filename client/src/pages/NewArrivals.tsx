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

const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const handleAddToCart = (product: Product) => {
    // Handle add to cart functionality
    console.log('Adding to cart:', product);
  };

  useEffect(() => {
    // Simulate fetching new arrivals
    // In a real app, this would fetch from your API with a "new arrivals" filter
    const fetchNewArrivals = async () => {
      try {
        // For now, we'll use the existing products and simulate new arrivals
        // You can replace this with actual API call
        const response = await fetch('/api/products?sort=newest&limit=20');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          // Fallback to sample data
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
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
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 dark:from-primary/20 dark:via-accent/20 dark:to-primary/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              New Arrivals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Discover the latest products that just arrived at TaproBuy. 
              Be the first to explore our newest collection of quality items.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {['all', 'electronics', 'clothing', 'books', 'home', 'sports'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                filter === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
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
              >
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
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No New Arrivals Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back soon for the latest products!
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

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Stay Updated with New Arrivals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and more!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            />
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewArrivals;
