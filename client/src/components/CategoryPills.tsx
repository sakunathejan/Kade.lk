import React from 'react';
import { motion } from 'framer-motion';

interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = selected === cat;
        return (
          <motion.button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`pill pill--sm ${isActive ? 'pill--active' : ''} relative overflow-hidden`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10">{cat[0].toUpperCase() + cat.slice(1)}</span>
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full"
                layoutId="activePill"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryPills;


