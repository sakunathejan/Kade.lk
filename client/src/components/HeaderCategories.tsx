import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoriesData } from '../utils/categories';

const HeaderCategories: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleMouseEnter = (categoryName: string) => {
    setExpandedCategory(categoryName);
  };

  const handleMouseLeave = () => {
    setExpandedCategory(null);
  };

  return (
    <div className="relative group">
      <motion.div 
        className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium"
        whileHover={{ y: -2 }}
      >
        <span>Categories</span>
        <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
      
      {/* Mega Menu Dropdown */}
      <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {categoriesData.slice(0, 5).map((category) => (
              <div 
                key={category.name} 
                className="relative group/cat"
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-lg">{category.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category.subcategories.length} subcategories
                    </div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      expandedCategory === category.name ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
                
                {/* Subcategories */}
                {expandedCategory === category.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                  >
                    <div className="p-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory}
                          to={`/category/${encodeURIComponent(category.name)}?subcategory=${encodeURIComponent(subcategory)}`}
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] rounded-md transition-colors duration-200"
                        >
                          {subcategory}
                        </Link>
                      ))}
                      
                      {/* View All Category Products Link */}
                      <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          to={`/category/${encodeURIComponent(category.name)}`}
                          className="block px-3 py-2 text-sm font-medium text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 rounded-md transition-colors duration-200 text-center"
                        >
                          View All {category.name} →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          
          {/* View All Categories Link */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link 
              to="/categories" 
              className="block w-full text-center px-4 py-2 text-sm font-medium text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 rounded-lg transition-colors duration-200"
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCategories;
