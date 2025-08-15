import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesData } from '../utils/categories';

const Categories: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (categoryName: string, subcategoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}?subcategory=${encodeURIComponent(subcategoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Explore Our
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Categories
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Discover amazing products organized by category and subcategory. Hover to explore specific product types.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid with Mega Menu Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hover over any category to see subcategories, or click to browse all products in that category
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesData.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Category Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Category Icon Background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-bl-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Main Content */}
                <div className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.subcategories.length} subcategories available
                      </p>
                    </div>
                    
                    {/* Arrow Icon */}
                    <motion.div
                      animate={{ rotate: hoveredCategory === category.name ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-blue-500 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Subcategories Preview */}
                  <div className="space-y-2">
                    {category.subcategories.slice(0, 3).map((subcategory, subIndex) => (
                      <motion.div
                        key={subcategory}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIndex * 0.1 }}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {subcategory}
                      </motion.div>
                    ))}
                    {category.subcategories.length > 3 && (
                      <div className="text-sm text-blue-500 font-medium pt-2">
                        +{category.subcategories.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl"></div>
              </motion.div>

              {/* Mega Menu Flyout Panel - Overlays on top */}
              {hoveredCategory === category.name && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-full top-0 ml-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                    {/* Flyout Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{category.icon}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.subcategories.length} subcategories available
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories List */}
                    <div className="p-4 max-h-80 overflow-y-auto">
                      <div className="space-y-2">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <motion.div
                            key={subcategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: subIndex * 0.03 }}
                            className="group/sub"
                          >
                            <button
                              onClick={() => handleSubcategoryClick(category.name, subcategory)}
                              className="w-full text-left p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group-hover/sub:bg-blue-100 dark:group-hover/sub:bg-blue-900/30 border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover/sub:scale-150 transition-transform duration-200"></div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400 transition-colors duration-200">
                                    {subcategory}
                                  </span>
                                </div>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.03 + 0.1 }}
                                  className="text-blue-500 opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </motion.div>
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* View All Category Button */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                      <button
                        onClick={() => handleCategoryClick(category.name)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View All {category.name} Products
                      </button>
                                         </div>
                   </motion.div>
                 )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Shopping?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our vast collection of products across all categories. Find the perfect items for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🛍️</span>
                Browse All Products
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
              >
                <span className="mr-2">🏠</span>
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {categoriesData.length}
                </div>
                <div className="text-blue-100 font-medium">Main Categories</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {categoriesData.reduce((total, cat) => total + cat.subcategories.length, 0)}
                </div>
                <div className="text-green-100 font-medium">Subcategories</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">⭐</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {categoriesData.reduce((total, cat) => total + cat.subcategories.length, 0) + categoriesData.length}
                </div>
                <div className="text-purple-100 font-medium">Total Options</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
