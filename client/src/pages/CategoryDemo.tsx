import React from 'react';
import CategorySection from '../components/CategorySection';

const CategoryDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Category Navigation Demo
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Experience our modern, responsive category navigation system designed for premium e-commerce websites
            </p>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <CategorySection />

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              What makes our category system special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Beautiful Design
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Modern gradient cards with smooth animations and hover effects
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fully Responsive
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optimized for all devices from mobile phones to desktop computers
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smooth Animations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Powered by Framer Motion for fluid, engaging user interactions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              How to Use
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Click on any category card</h3>
                  <p className="text-gray-600 dark:text-gray-400">Each category card is clickable and will expand to show subcategories</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Explore subcategories</h3>
                  <p className="text-gray-600 dark:text-gray-400">Hover over subcategory items to see interactive effects and navigation arrows</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Responsive behavior</h3>
                  <p className="text-gray-600 dark:text-gray-400">The grid automatically adjusts from 1 column on mobile to 4 columns on large screens</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip:</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                You can easily customize the categories, colors, and icons by modifying the categories array in the component. 
                The component is fully typed with TypeScript for better development experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDemo;
