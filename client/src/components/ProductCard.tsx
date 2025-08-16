import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    slug?: string;
    media?: Array<{ url: string; type: string }>;
    images?: Array<{ url: string }>;
  };
  onAddToCart: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { title, description, price, category, media, images, _id, slug = '' } = product;
  const navigate = useNavigate();

  // Get the first available image (prioritize media array, fallback to images)
  const getFirstImage = () => {
    if (media && media.length > 0) {
      const firstImage = media.find((item: any) => item.type === 'image');
      if (firstImage && firstImage.url) return firstImage.url;
    }
    
    if (images && images.length > 0) {
      return images[0].url;
    }
    
    return null;
  };

  const firstImage = getFirstImage();

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image failed to load:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove('hidden');
  };

  // Handle image load success
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'block';
    e.currentTarget.nextElementSibling?.classList.add('hidden');
  };

  // Handle card click to navigate to product details
  const handleCardClick = () => {
    if (slug) {
      navigate(`/product/${slug}`); // Cleaner URL without 'slug' prefix
    } else {
      navigate(`/product/${_id}`);
    }
  };

  // Handle add to cart click (prevent navigation)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Link to={slug ? `/product/${slug}` : `/product/${_id}`} className="block">
      <motion.div 
        className="card overflow-hidden group dark:border-gray-700 dark:bg-gray-900 cursor-pointer"
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={handleCardClick}
      >
      <div className="relative h-36 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 overflow-hidden">
        {/* Category Badge */}
        <motion.div 
          className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border text-gray-700 dark:text-gray-300 z-10"
          whileHover={{ scale: 1.1 }}
        >
          {category}
        </motion.div>
        
        {/* Product Image or Icon */}
        {firstImage ? (
          <>
            <motion.img
              src={firstImage}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {/* Fallback icon (hidden by default, shown on image error) */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-indigo-400 dark:text-gray-600 hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <i className="fa-solid fa-bag-shopping text-4xl opacity-60" />
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-indigo-400 dark:text-gray-600"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fa-solid fa-bag-shopping text-4xl opacity-60" />
          </motion.div>
        )}
        
        {/* Shop Now Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.span 
            className="text-white font-semibold text-lg"
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            View Details
          </motion.span>
        </motion.div>
      </div>
      <div className="p-4">
        <motion.h3 
          className="font-medium text-gray-900 dark:text-gray-100 overflow-hidden whitespace-nowrap text-ellipsis mb-2"
          whileHover={{ color: 'var(--color-primary)' }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 h-10 overflow-hidden mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <motion.div 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            Rs. {price.toLocaleString()}
          </motion.div>
          <motion.button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-cart-plus mr-2" />
            Add to Cart
          </motion.button>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;


