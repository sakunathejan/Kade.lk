import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { state, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        
        <nav className="hidden md:flex items-center gap-6">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium">
              Home
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/cart" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium">
              Cart ({state.cart.length})
            </Link>
          </motion.div>
          
          {state.isAuthenticated && state.user?.role === 'admin' && (
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium">
                Admin
              </Link>
            </motion.div>
          )}
          
          {state.isAuthenticated && state.user?.role === 'superadmin' && (
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/superadmin" className="text-gray-700 hover:text-[color:var(--color-primary)] dark:text-gray-300 dark:hover:text-white transition-colors duration-200 font-medium">
                Super Admin
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {state.isAuthenticated ? (
            <motion.div className="flex items-center gap-3">
              <span className="text-sm text-muted hidden sm:block">
                Welcome, {state.user?.name || 'User'}
              </span>
              <motion.button
                onClick={handleLogout}
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
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
    </motion.header>
  );
};

export default Header;


