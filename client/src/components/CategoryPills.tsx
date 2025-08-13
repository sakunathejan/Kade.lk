import React from 'react';

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
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`pill pill--sm ${isActive ? 'pill--active' : ''}`}
          >
            {cat[0].toUpperCase() + cat.slice(1)}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;


