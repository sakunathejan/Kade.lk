import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { api } from '../services/http';
import { getSubcategories } from '../utils/categories';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  stock: number;
  ratings: number;
  isActive: boolean;
  media?: Array<{ url: string; type: string }>;
  images?: Array<{ url: string }>;
  seller: {
    name: string;
    _id: string;
  };
}

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get('subcategory');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/products?category=${encodeURIComponent(category!)}`;
      
      // Add subcategory filter if present
      if (subcategory) {
        url += `&subcategory=${encodeURIComponent(subcategory)}`;
      }
      
      const response = await api.get(url);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, subcategory]);

  useEffect(() => {
    if (category) {
      console.log('CategoryProducts: category from params:', category);
      console.log('CategoryProducts: subcategory from query:', subcategory);
      loadProducts();
    }
  }, [category, subcategory, loadProducts]);

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-center mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <Link 
            to={`/category/${encodeURIComponent(category!)}`} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {category}
          </Link>
          {subcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900 dark:text-white font-medium">{subcategory}</span>
            </>
          )}
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {subcategory ? `${subcategory} Products` : `${category} Products`}
        </h1>
        
        {subcategory && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
            Showing {subcategory} products in {category}
          </p>
        )}

        {/* Subcategory Filter */}
        <div className="mb-8 text-center">
          <div className="inline-flex flex-wrap gap-2 justify-center">
            <Link
              to={`/category/${encodeURIComponent(category!)}`}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                !subcategory
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All {category}
            </Link>
            {getSubcategories(category!).map((subcat) => (
              <Link
                key={subcat}
                to={`/category/${encodeURIComponent(category!)}?subcategory=${encodeURIComponent(subcat)}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  subcategory === subcat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {subcat}
              </Link>
            ))}
          </div>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard 
                  product={{
                    ...product,
                    title: product.name,
                    media: product.media,
                    images: product.images
                  }} 
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {subcategory 
                ? `No ${subcategory.toLowerCase()} products found in ${category?.toLowerCase()}`
                : `No ${category?.toLowerCase()} products found`
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {subcategory 
                ? `Try browsing all ${category} products or check back later for new ${subcategory} items.`
                : `Try browsing other categories or check back later for new products.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
