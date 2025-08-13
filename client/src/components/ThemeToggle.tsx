import React, { useEffect, useState } from 'react';
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

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
          updateThemeState();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    return () => observer.disconnect();
  }, []);

  const onToggle = () => {
    const nextTheme = toggleTheme();
    setIsDark(nextTheme === 'dark');
  };

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-all duration-300 ease-in-out
        ${isDark ? 'bg-[color:var(--color-surface)] border-[color:var(--color-border)]' : 'bg-[color:var(--color-surface)] border-[color:var(--color-border)]'}`}
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transform transition-all duration-300 ease-in-out
          ${isDark ? 'translate-x-6' : 'translate-x-1'}`}
      >
        {isDark ? (
          <i className="fa-solid fa-moon text-[color:var(--color-text)]" />
        ) : (
          <i className="fa-solid fa-sun text-[color:var(--color-primary)]" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;


