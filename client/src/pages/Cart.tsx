import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = state.cart.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    // Update cart by removing and re-adding with new quantity
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    updatedCart.forEach(item => {
      if (item._id === productId) {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      }
    });
  };

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (state.cart.length === 0) {
    return (
      <div className="container-3d max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-12"
        >
          <div className="text-6xl mb-6 text-muted">
            <i className="fa-solid fa-shopping-cart" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted mb-8 text-lg">
            Looks like you haven't added any products to your cart yet.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="btn btn-primary text-lg px-8 py-4">
              <i className="fa-solid fa-arrow-left mr-2" />
              Start Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-3d max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
          Shopping Cart
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="space-y-6">
            {state.cart.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-image text-2xl text-muted" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2 truncate">{item.title}</h3>
                    <div className="text-xl font-bold text-[color:var(--color-primary)]">
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fa-solid fa-minus text-sm" />
                      </motion.button>
                      
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      
                      <motion.button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fa-solid fa-plus text-sm" />
                      </motion.button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted">Total</div>
                      <div className="text-lg font-bold text-[color:var(--color-primary)]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remove item"
                    >
                      <i className="fa-solid fa-trash" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="card card--elevated p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({state.cart.length} items)</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[color:var(--color-primary)]">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
 <span>Rs. {(total * 0.15).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-[color:var(--color-primary)]">
                  Rs. {(total * 1.15).toLocaleString()}
                </span>
              </div>
            </div>
            
            <motion.div className="space-y-4">
              <motion.button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="w-full btn btn-outline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fa-solid fa-trash mr-2" />
                Clear Cart
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/checkout" className="w-full btn btn-primary text-lg py-4 block text-center">
                  <i className="fa-solid fa-credit-card mr-2" />
                  Proceed to Checkout
                </Link>
              </motion.div>
            </motion.div>
            
            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-shield-halved text-blue-600 dark:text-blue-400 mt-1" />
                <div className="text-sm">
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Secure Checkout
                  </div>
                  <div className="text-blue-700 dark:text-blue-300">
                    Your payment information is protected with bank-level security.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
    </div>
  );
};

export default Cart;


