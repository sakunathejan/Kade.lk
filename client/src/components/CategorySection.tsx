import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Subcategory {
  name: string;
  icon?: string;
}

interface Category {
  name: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

// Custom SVG Icons
const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const categories: Category[] = [
  {
    name: 'Electronics & Gadgets',
    icon: '📱',
    color: 'from-blue-500 to-blue-600',
    subcategories: [
      { name: 'Mobiles, Tablets & Accessories' },
      { name: 'Computers, Laptops & Accessories' },
      { name: 'TVs, Audio & Video' },
      { name: 'Cameras & Photography' },
      { name: 'Wearables & Smart Devices' }
    ]
  },
  {
    name: 'Home & Kitchen',
    icon: '🏠',
    color: 'from-green-500 to-green-600',
    subcategories: [
      { name: 'Furniture' },
      { name: 'Home Décor' },
      { name: 'Kitchenware & Appliances' },
      { name: 'Bedding & Bath' },
      { name: 'Lighting & Electricals' }
    ]
  },
  {
    name: 'Clothing & Fashion',
    icon: '👕',
    color: 'from-purple-500 to-purple-600',
    subcategories: [
      { name: 'Men\'s Clothing' },
      { name: 'Women\'s Clothing' },
      { name: 'Kids & Baby Clothing' },
      { name: 'Footwear' },
      { name: 'Bags, Wallets & Accessories' }
    ]
  },
  {
    name: 'Beauty, Health & Personal Care',
    icon: '💄',
    color: 'from-pink-500 to-pink-600',
    subcategories: [
      { name: 'Skincare' },
      { name: 'Haircare' },
      { name: 'Makeup & Cosmetics' },
      { name: 'Fragrances & Deodorants' },
      { name: 'Health & Wellness Products' }
    ]
  },
  {
    name: 'Sports, Fitness & Outdoors',
    icon: '🏃‍♂️',
    color: 'from-orange-500 to-orange-600',
    subcategories: [
      { name: 'Gym & Fitness Equipment' },
      { name: 'Sportswear & Footwear' },
      { name: 'Outdoor & Camping Gear' }
    ]
  },
  {
    name: 'Toys, Kids & Baby Products',
    icon: '🧸',
    color: 'from-yellow-500 to-yellow-600',
    subcategories: [
      { name: 'Toys & Games' },
      { name: 'Baby Gear & Essentials' },
      { name: 'Educational Toys' }
    ]
  },
  {
    name: 'Automotive',
    icon: '🚗',
    color: 'from-red-500 to-red-600',
    subcategories: [
      { name: 'Car Accessories' },
      { name: 'Bike Accessories' },
      { name: 'Spare Parts & Tools' }
    ]
  },
  {
    name: 'Books, Stationery & Hobbies',
    icon: '📚',
    color: 'from-indigo-500 to-indigo-600',
    subcategories: [
      { name: 'Books & Magazines' },
      { name: 'Art & Craft Supplies' },
      { name: 'Musical Instruments' }
    ]
  },
  {
    name: 'Groceries & Food',
    icon: '🛒',
    color: 'from-emerald-500 to-emerald-600',
    subcategories: [
      { name: 'Packaged Foods' },
      { name: 'Beverages' },
      { name: 'Fresh Produce' }
    ]
  },
  {
    name: 'Tools, Hardware & Industrial',
    icon: '🔧',
    color: 'from-gray-500 to-gray-600',
    subcategories: [
      { name: 'Hand Tools & Power Tools' },
      { name: 'Safety & Security Equipment' },
      { name: 'Industrial Supplies' }
    ]
  },
  {
    name: 'Pet Supplies',
    icon: '🐾',
    color: 'from-amber-500 to-amber-600',
    subcategories: [
      { name: 'Food & Treats' },
      { name: 'Accessories & Care Products' }
    ]
  },
  {
    name: 'Jewelry & Watches',
    icon: '💍',
    color: 'from-rose-500 to-rose-600',
    subcategories: [
      { name: 'Fashion Jewelry' },
      { name: 'Fine Jewelry' },
      { name: 'Watches' }
    ]
  },
  {
    name: 'Gifts & Occasions',
    icon: '🎁',
    color: 'from-cyan-500 to-cyan-600',
    subcategories: [
      { name: 'Gift Sets & Hampers' },
      { name: 'Seasonal & Festive Items' }
    ]
  }
];

const CategorySection: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const isExpanded = (categoryName: string) => expandedCategories.has(categoryName);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our extensive collection of products organized into carefully curated categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Category Card */}
              <motion.div
                className={`
                  relative overflow-hidden rounded-xl shadow-lg cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${hoveredCategory === category.name ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
                `}
                onClick={() => toggleCategory(category.name)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                
                {/* Content */}
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{category.icon}</span>
                    <motion.div
                      animate={{ rotate: isExpanded(category.name) ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isExpanded(category.name) ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </motion.div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">
                    {category.subcategories.length} subcategories
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </motion.div>

              {/* Subcategories Dropdown */}
              {isExpanded(category.name) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute top-full left-0 right-0 z-10 mt-2"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                        {category.name}
                      </h4>
                      <ul className="space-y-2">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <motion.li
                            key={subcategory.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                            className="group/sub"
                          >
                            <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 flex items-center justify-between">
                              <span>{subcategory.name}</span>
                              <span className="opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200 text-blue-500">
                                →
                              </span>
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">🔍</span>
            Explore All Categories
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
