import React from 'react';

export interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
  };
  onAddToCart: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { title, description, price, category } = product;

  return (
    <div className="card overflow-hidden group dark:border-gray-700 dark:bg-gray-900">
      <div className="relative h-36 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-white/80 border text-gray-700">
          {category}
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-400 dark:text-gray-600">
          <i className="fa-solid fa-bag-shopping text-4xl opacity-60 group-hover:scale-110 transform transition-transform duration-200" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 overflow-hidden whitespace-nowrap text-ellipsis">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 h-10 overflow-hidden">{description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rs. {price.toLocaleString()}</div>
          <button
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 text-sm"
            onClick={() => onAddToCart(product)}
          >
            <i className="fa-solid fa-cart-plus mr-1" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


