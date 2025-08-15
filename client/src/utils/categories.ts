export interface Category {
  name: string;
  icon: string;
  subcategories: string[];
}

export const categoriesData: Category[] = [
  {
    name: 'Electronics',
    icon: '🔌',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Audio & Headphones', 'Cameras', 'Gaming', 'Smart Home', 'Wearables', 'Accessories']
  },
  {
    name: 'Fashion',
    icon: '👕',
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Shoes', 'Bags & Accessories', 'Jewelry', 'Watches', 'Sportswear', 'Underwear & Lingerie']
  },
  {
    name: 'Home & Garden',
    icon: '🏠',
    subcategories: ['Furniture', 'Kitchen & Dining', 'Bedding', 'Bath', 'Decor', 'Garden Tools', 'Outdoor Living', 'Storage', 'Lighting']
  },
  {
    name: 'Sports',
    icon: '⚽',
    subcategories: ['Team Sports', 'Fitness', 'Outdoor Sports', 'Water Sports', 'Winter Sports', 'Cycling', 'Running', 'Yoga', 'Equipment']
  },
  {
    name: 'Books',
    icon: '📚',
    subcategories: ['Fiction', 'Non-Fiction', 'Academic', 'Children\'s Books', 'Comics & Manga', 'Magazines', 'Audiobooks', 'E-books', 'Textbooks']
  },
  {
    name: 'Beauty',
    icon: '💄',
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Bath & Body', 'Tools & Brushes', 'Men\'s Grooming', 'Natural & Organic', 'Professional']
  },
  {
    name: 'Toys',
    icon: '🧸',
    subcategories: ['Action Figures', 'Board Games', 'Building Sets', 'Dolls', 'Educational', 'Outdoor Toys', 'Puzzles', 'Video Games', 'Arts & Crafts']
  },
  {
    name: 'Automotive',
    icon: '🚗',
    subcategories: ['Car Parts', 'Accessories', 'Tools', 'Maintenance', 'Electronics', 'Interior', 'Exterior', 'Performance', 'Motorcycle']
  },
  {
    name: 'Health',
    icon: '🏥',
    subcategories: ['Supplements', 'Medical Devices', 'Personal Care', 'Fitness Equipment', 'Wellness', 'First Aid', 'Mobility Aids', 'Monitoring', 'Therapy']
  },
  {
    name: 'Food & Beverages',
    icon: '🍎',
    subcategories: ['Snacks', 'Beverages', 'Organic', 'Gourmet', 'Health Foods', 'Baking', 'Cooking', 'Supplements', 'International']
  },
  {
    name: 'Other',
    icon: '📦',
    subcategories: ['Office Supplies', 'Pet Supplies', 'Baby Products', 'Art Supplies', 'Musical Instruments', 'Collectibles', 'Antiques', 'Vintage', 'Custom']
  }
];

// Get just the category names for simple lists
export const categoryNames = ['all', ...categoriesData.map(cat => cat.name)];

// Get subcategories for a specific category
export const getSubcategories = (categoryName: string): string[] => {
  const category = categoriesData.find(cat => cat.name === categoryName);
  return category ? category.subcategories : [];
};

// Get category icon
export const getCategoryIcon = (categoryName: string): string => {
  const category = categoriesData.find(cat => cat.name === categoryName);
  return category ? category.icon : '📦';
};
