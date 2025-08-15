import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface Category {
  _id: string;
  name: string;
  icon: string;
  subcategories: string[];
  isActive: boolean;
  order: number;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    subcategories: '',
    isActive: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name) {
      alert('Please enter a category name');
      return;
    }

    try {
      const subcategoriesArray = categoryForm.subcategories
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newCategory = {
        name: categoryForm.name,
        icon: categoryForm.icon || '📁',
        subcategories: subcategoriesArray,
        isActive: categoryForm.isActive,
        order: categories.length
      };

      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });

      setShowCreateModal(false);
      resetForm();
      loadCategories();
      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) return;

    try {
      const subcategoriesArray = categoryForm.subcategories
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const updatedCategory = {
        name: categoryForm.name,
        icon: categoryForm.icon || '📁',
        subcategories: subcategoriesArray,
        isActive: categoryForm.isActive
      };

      await fetch(`/api/categories/${selectedCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory)
      });

      setShowEditModal(false);
      resetForm();
      loadCategories();
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      loadCategories();
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const handleToggleCategory = async (categoryId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      loadCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
    }
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      icon: '',
      subcategories: '',
      isActive: true
    });
    setSelectedCategory(null);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      subcategories: category.subcategories.join(', '),
      isActive: category.isActive
    });
    setShowEditModal(true);
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{category.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleExpanded(category._id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {expandedCategories.has(category._id) ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {expandedCategories.has(category._id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategories:</h4>
                  {category.subcategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((subcategory, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {subcategory}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No subcategories</p>
                  )}
                </div>

                <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="Edit Category"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleCategory(category._id, category.isActive)}
                    className={`${
                      category.isActive 
                        ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' 
                        : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                    }`}
                    title={category.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Category"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="📁"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcategories</label>
                <textarea
                  value={categoryForm.subcategories}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subcategories: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter subcategories separated by commas"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Active
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Category</h3>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcategories</label>
                <textarea
                  value={categoryForm.subcategories}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subcategories: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Active
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Update Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
