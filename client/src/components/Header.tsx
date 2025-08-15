import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { state, logout } = useAppContext();
  const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-[color:var(--color-surface)]/90 bg-[color:var(--color-surface)]/95 dark:supports-[backdrop-filter]:bg-[color:var(--color-surface)]/90 border-b border-[color:var(--color-border)]/50"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
            TaproBuy
          </Link>
        </motion.div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 dark:bg-gray-700 dark:text-white"
              aria-label="Search products"
            />
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium">
              Home
            </Link>
          </motion.div>
          
          {/* Products Dropdown */}
          <div className="relative group">
            <motion.div 
              className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium"
              whileHover={{ y: -2 }}
            >
              <span>Products</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50">
              <div className="py-2">
                <Link to="/products" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-box mr-2"></i>All Products
                </Link>
                <Link to="/new-arrivals" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-star mr-2"></i>New Arrivals
                </Link>
                <Link to="/best-sellers" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-trophy mr-2"></i>Best Sellers
                </Link>
                <Link to="/deals" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-fire mr-2"></i>Deals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Categories Dropdown */}
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
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50">
              <div className="py-2">
                <Link to="/categories/electronics" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-mobile-alt mr-2"></i>Electronics
                </Link>
                <Link to="/categories/food" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-utensils mr-2"></i>Food
                </Link>
                <Link to="/categories/clothing" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-tshirt mr-2"></i>Clothing
                </Link>
                <Link to="/categories/beauty" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-spa mr-2"></i>Beauty
                </Link>
                <Link to="/categories" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <i className="fa-solid fa-tags mr-2"></i>View All Categories
                </Link>
              </div>
            </div>
          </div>
          
          {/* Support Dropdown */}
          <div className="relative group">
            <motion.div 
              className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium"
              whileHover={{ y: -2 }}
            >
              <span>Support</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50">
              <div className="py-2">
                <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-question-circle mr-2"></i>Help Center
                </Link>
                <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-envelope mr-2"></i>Contact Us
                </Link>
                <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200">
                  <i className="fa-solid fa-info-circle mr-2"></i>About Us
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 mobile-menu-container"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/cart" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium flex items-center gap-2">
              <i className="fa-solid fa-shopping-cart"></i>
              Cart ({state.cart.length})
            </Link>
          </motion.div>
          
          <ThemeToggle />
          
          {state.isAuthenticated ? (
            <motion.div className="flex items-center gap-3">
              <div className="relative group">
                <motion.div 
                  className="flex items-center gap-2 cursor-pointer text-sm text-muted hover:text-[color:var(--color-primary)] transition-colors duration-200"
                  whileHover={{ y: -2 }}
                >
                  <span className="hidden sm:block">
                    Welcome, {state.user?.name || 'User'}
                  </span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
                
                {/* Dropdown Menu */}
                <motion.div 
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50 pointer-events-none group-hover:pointer-events-auto"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  whileHover={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <div className="py-2">
                    {state.user?.role === 'admin' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-chart-line text-[color:var(--color-primary)]"></i>
                            Admin Dashboard
                          </div>
                        </Link>
                      </motion.div>
                    )}
                    
                    {state.user?.role === 'superadmin' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link 
                          to="/superadmin" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[color:var(--color-primary)] transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-crown text-[color:var(--color-accent)]"></i>
                            Super Admin Dashboard
                          </div>
                        </Link>
                      </motion.div>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-sign-out-alt text-red-500"></i>
                          Logout
                        </div>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn btn-outline">
                  Register
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 mobile-menu-container ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-4 py-6 space-y-4">
          {/* Mobile Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }}
            transition={{ delay: 0.05 }}
            className="mb-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 dark:bg-gray-700 dark:text-white"
                aria-label="Search products"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
            transition={{ delay: 0.1 }}
          >
            <Link 
              to="/" 
              className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-home mr-3"></i>
              Home
            </Link>
          </motion.div>

          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
            transition={{ delay: 0.15 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">PRODUCTS</div>
            <Link 
              to="/products" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-box mr-3"></i>
              All Products
            </Link>
            <Link 
              to="/new-arrivals" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-star mr-3"></i>
              New Arrivals
            </Link>
            <Link 
              to="/best-sellers" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-trophy mr-3"></i>
              Best Sellers
            </Link>
            <Link 
              to="/deals" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-fire mr-3"></i>
              Deals
            </Link>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
            transition={{ delay: 0.25 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">CATEGORIES</div>
            <Link 
              to="/categories/electronics" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-mobile-alt mr-3"></i>
              Electronics
            </Link>
            <Link 
              to="/categories/food" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-utensils mr-3"></i>
              Food
            </Link>
            <Link 
              to="/categories/clothing" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-tshirt mr-3"></i>
              Clothing
            </Link>
            <Link 
              to="/categories/beauty" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-spa mr-3"></i>
              Beauty
            </Link>
            <Link 
              to="/categories" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-tags mr-3"></i>
              View All Categories
            </Link>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
            transition={{ delay: 0.35 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">SUPPORT</div>
            <Link 
              to="/help" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-question-circle mr-3"></i>
              Help Center
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-envelope mr-3"></i>
              Contact Us
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-base text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-info-circle mr-3"></i>
              About Us
            </Link>
          </motion.div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
              transition={{ delay: 0.55 }}
            >
              <Link 
                to="/cart" 
                className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[color:var(--color-primary)] transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-shopping-cart mr-3"></i>
                Cart ({state.cart.length})
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;


