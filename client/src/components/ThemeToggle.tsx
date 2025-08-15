import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toggleTheme, getCurrentTheme } from '../theme';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Set initial theme state
    const updateThemeState = () => {
      const currentTheme = getCurrentTheme();
      setIsDark(currentTheme === 'dark');
    };

    // Initial theme state
    updateThemeState();

    // Listen for theme changes by checking periodically
    const interval = setInterval(updateThemeState, 100);

    return () => clearInterval(interval);
  }, []);

  const onToggle = () => {
    const nextTheme = toggleTheme();
    setIsDark(nextTheme === 'dark');
  };

  return (
    <motion.button
      onClick={onToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-all duration-300 ease-in-out hover:shadow-lg"
    >
      <motion.span
        layout
        animate={{ x: isDark ? 24 : 4 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
      >
        <motion.i 
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`fa-solid ${isDark ? 'fa-moon text-gray-700' : 'fa-sun text-yellow-500'}`}
        />
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;


