import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MediaUpload from '../ui/MediaUpload';
import { useAppContext } from '../../context/AppContext';
import { api } from '../../services/http';
import { categoriesData, getSubcategories } from '../../utils/categories';

interface MediaFile {
  file: File;
  preview: string;
  id: string;
  type: 'image' | 'video';
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  stock: number;
  media?: Array<{ url: string; type: string }>;
  images?: Array<{ url: string }>; // Keep for backward compatibility
  seller: { name: string; _id?: string };
  ratings: number;
  isActive: boolean;
}

const ProductManagement: React.FC = () => {
  const { state } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Form state for creating/editing products
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    stock: ''
  });



  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products/super-admin');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}/super-admin`);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category || !productForm.subcategory || !productForm.stock) {
      alert('Please fill in all required fields');
      return;
    }

    if (!state.user?.id) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    if (selectedMedia.length === 0) {
      alert('Please select at least one image or video');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('subcategory', productForm.subcategory);
      formData.append('stock', productForm.stock);
      // Use current user's ID as seller
      formData.append('seller', state.user?.id || '');
      
      // Append images
      selectedMedia.forEach((media, index) => {
        formData.append('media', media.file);
      });

              await api.post('/api/products/super-admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form and close modal
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        stock: ''
      });
      setSelectedMedia([]);
      setShowCreateModal(false);
      loadProducts();

      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    // Edit functionality removed for now
    console.log('Edit product:', product);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      stock: ''
    });
    setSelectedMedia([]);
  };



  // Handle category change and reset subcategory
  const handleCategoryChange = (categoryName: string) => {
    setProductForm(prev => ({
      ...prev,
      category: categoryName,
      subcategory: '' // Reset subcategory when category changes
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Product Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage all products across the platform
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="text-sm mr-2">➕</span>
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="bg-gray-200 dark:bg-gray-700">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Stock: {product.stock}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Seller: {product.seller.name}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-500 mr-1">★</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.ratings.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                                                <button
                                onClick={() => handleEditProduct(product)}
                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                              >
                                Edit
                              </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create New Product
                </h3>
                                            <button
                              onClick={() => {
                                setShowCreateModal(false);
                                resetForm();
                              }}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <span className="text-2xl">×</span>
                            </button>
              </div>

                             <form onSubmit={handleCreateProduct} className="space-y-6">
                 {/* Category Preview */}
                 {productForm.category && (
                   <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                     <div className="flex items-center space-x-3">
                       <span className="text-2xl">
                         {categoriesData.find(cat => cat.name === productForm.category)?.icon}
                       </span>
                       <div>
                         <h4 className="font-medium text-blue-900 dark:text-blue-100">
                           Selected Category: {productForm.category}
                         </h4>
                         {productForm.subcategory && (
                           <p className="text-sm text-blue-700 dark:text-blue-300">
                             Subcategory: {productForm.subcategory}
                           </p>
                         )}
                       </div>
                     </div>
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Category *
                     </label>
                     <select 
                       value={productForm.category}
                       onChange={(e) => handleCategoryChange(e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                       required
                     >
                       <option value="">Select Category</option>
                       {categoriesData.map((category) => (
                         <option key={category.name} value={category.name}>
                           {category.icon} {category.name}
                         </option>
                       ))}
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Subcategory *
                     </label>
                     <select
                       value={productForm.subcategory}
                       onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                       required
                       disabled={!productForm.category}
                     >
                       <option value="">
                         {productForm.category ? 'Select Subcategory' : 'Select Category First'}
                       </option>
                       {productForm.category && getSubcategories(productForm.category).map((subcategory) => (
                         <option key={subcategory} value={subcategory}>
                           {subcategory}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     Stock Quantity *
                   </label>
                   <input
                     type="number"
                     value={productForm.stock}
                     onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                     placeholder="0"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     Seller
                   </label>
                   <input
                     type="text"
                     value={state.user?.name || 'Current User'}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                     disabled
                   />
                   <p className="text-xs text-gray-500 mt-1">Product will be assigned to your account</p>
                 </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Media (Images & Videos) *
                  </label>
                  <MediaUpload
                    media={selectedMedia}
                    onMediaChange={setSelectedMedia}
                    maxFiles={10}
                    acceptedTypes={['image', 'video']}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
