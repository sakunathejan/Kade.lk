import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../services/http';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { 
  StarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  EyeIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  ShareIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useAppContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  console.log('ProductDetails component loaded with id:', id);

  // Fetch product data
  const { data: productResponse, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product with id:', id);
      try {
        const res = await api.get(`/products/${id}`);
        console.log('Product API response:', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
    enabled: !!id,
  });

  // Extract product data from response
  const product = productResponse?.data || productResponse;
  console.log('ProductDetails state:', { product, isLoading, isError, productResponse });

  // Fetch related products
  const { data: relatedResponse } = useQuery({
    queryKey: ['relatedProducts', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/products/${id}/related`);
        console.log('Related products response:', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching related products:', error);
        return { data: [] };
      }
    },
    enabled: !!id,
  });

  const relatedProducts = relatedResponse?.data || relatedResponse || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !product) {
    console.log('Rendering error state:', { isError, product, productResponse });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">ID: {id}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Response: {JSON.stringify(productResponse)}</p>
          <Link to="/products" className="text-primary hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  const p = product;
  console.log('Product data:', p);

  // Get images from product
  const getImages = () => {
    if (p.media && p.media.length > 0) {
      return p.media.filter((item: any) => item.type === 'image').map((item: any) => item.url);
    }
    if (p.images && p.images.length > 0) {
      return p.images.map((img: any) => img.url || img);
    }
    return [];
  };

  const images = getImages();
  const hasImages = images.length > 0;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price?.toLocaleString() || '0'}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                  <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                    Products
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{p.name || 'Product'}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Product Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4 leading-tight">
            {p.name || 'Product Name'}
          </h1>
        </div>
      </div>

      {/* Main Product Display Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl group">
              {hasImages ? (
                <>
                  <motion.img
                    key={selectedImageIndex}
                    src={images[selectedImageIndex]}
                    alt={p.name || 'Product'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-3 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        aria-label="Previous image"
                      >
                        <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-3 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        aria-label="Next image"
                      >
                        <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <motion.button
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HeartIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <div className="text-center">
                    <EyeIcon className="h-24 w-24 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      index === selectedImageIndex
                        ? 'border-primary ring-2 ring-primary/20 scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:scale-105'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${p.name || 'Product'} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="text-center">
              <motion.button
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </motion.button>
            </div>
          </div>

          {/* Right Side - Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {p.category && (
                  <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                    {p.category}
                  </span>
                )}
                {p.subcategory && (
                  <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
                    {p.subcategory}
                  </span>
                )}
              </div>
              
              {p.brand && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Brand: <span className="font-semibold text-gray-900 dark:text-white">{p.brand}</span>
                </p>
              )}
            </div>

            {/* Seller Information */}
            {p.seller && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {p.seller.name || 'Seller'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Seller ID: {p.seller._id || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      99.8% positive
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-4">
                  <button className="text-sm text-primary hover:underline">Seller's other items</button>
                  <button className="text-sm text-primary hover:underline">Contact seller</button>
                </div>
              </div>
            )}

            {/* Ratings */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center space-x-1">
                {renderStars(p.ratings || 0)}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  ({p.numOfReviews || 0} reviews)
                </span>
              </div>
              {p.ratings && p.ratings >= 4.5 && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center space-x-1">
                  <CheckIcon className="h-3 w-3" />
                  Top Rated
                </span>
              )}
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(p.price)}
                </span>
                {p.discountPrice && p.discountPrice < p.price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(p.discountPrice)}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                      {Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Condition */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Condition:</span>
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                New
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className={`w-4 h-4 rounded-full ${
                (p.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-sm font-medium ${
                (p.stock || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {(p.stock || 0) > 0 ? `${p.stock} in stock` : 'Out of stock'}
              </span>
              {(p.stock || 0) > 0 && (p.stock || 0) <= 10 && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  Low Stock
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                onClick={() => addToCart({ ...p, quantity })}
                disabled={(p.stock || 0) === 0}
                className="w-full flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold text-lg rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCartIcon className="h-6 w-6 mr-3" />
                Add to Cart
              </motion.button>
              
              <motion.button
                disabled={(p.stock || 0) === 0}
                className="w-full flex items-center justify-center px-8 py-4 bg-accent text-white font-semibold text-lg rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy Now
              </motion.button>

              <motion.button
                className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-lg rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HeartIcon className="h-6 w-6 mr-3" />
                Add to Watchlist
              </motion.button>
            </div>

            {/* Policy Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Breathe easy. Returns accepted.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  People want this. {Math.floor(Math.random() * 50) + 20} people are watching this.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Description', icon: EyeIcon },
                { id: 'specifications', label: 'Specifications', icon: CheckIcon },
                { id: 'reviews', label: 'Reviews', icon: StarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-6 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Product Description
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                    {p.description || 'No description available for this product.'}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                key="specifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Product Specifications
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  {p.specifications && p.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {p.specifications.map((spec: any, index: number) => (
                        <div key={index} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{spec.key}</span>
                          <span className="text-gray-600 dark:text-gray-400">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                      <CheckIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No specifications available for this product.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Customer Reviews
                </h3>
                
                {/* Rating Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {(p.ratings || 0).toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {renderStars(p.ratings || 0)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Based on {p.numOfReviews || 0} reviews
                    </p>
                  </div>
                </div>

                {/* Review Form */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Write a Review
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Comment
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Share your experience with this product..."
                      />
                    </div>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      Submit Review
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Similar Items
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Sponsored</p>
              </div>
              <button className="text-primary hover:underline">See all</button>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={{
                    _id: relatedProduct._id,
                    title: relatedProduct.name || relatedProduct.title,
                    description: relatedProduct.description || '',
                    price: relatedProduct.price,
                    category: relatedProduct.category,
                    media: relatedProduct.media,
                    images: relatedProduct.images
                  }}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="lg:hidden">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                {relatedProducts.map((relatedProduct: any) => (
                  <div key={relatedProduct._id} className="flex-shrink-0 w-72">
                    <ProductCard
                      product={{
                        _id: relatedProduct._id,
                        title: relatedProduct.name || relatedProduct.title,
                        description: relatedProduct.description || '',
                        price: relatedProduct.price,
                        category: relatedProduct.category,
                        media: relatedProduct.media,
                        images: relatedProduct.images
                      }}
                      onAddToCart={addToCart}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;


