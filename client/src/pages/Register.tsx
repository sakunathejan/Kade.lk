import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const Register: React.FC = () => {
  const { registerCustomer } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await registerCustomer({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });
      
      // Show success message and redirect to login
      alert('Account created successfully! Please login with your credentials.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-3d min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent mb-2">
              TaproBuy
            </h1>
          </motion.div>
          <p className="text-muted text-lg">Create your customer account</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input w-full pl-12"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input w-full pl-12"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <i className="fa-solid fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"></i>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input w-full pl-12"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Address *
              </label>
              <div className="relative">
                <i className="fa-solid fa-map-marker-alt absolute left-4 top-3 text-muted"></i>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input w-full pl-12 h-20 resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"></i>
                <input
                  type={showPasswords.password ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input w-full pl-12 pr-12"
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, password: !prev.password }))}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.password ? (
                    <span className="text-xs">🙈</span>
                  ) : (
                    <span className="text-xs">👁️</span>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-muted"></i>
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input w-full pl-12 pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.confirmPassword ? (
                    <span className="text-xs">🙈</span>
                  ) : (
                    <span className="text-xs">👁️</span>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400" />
                  <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary text-lg py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus mr-2" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[color:var(--color-primary)] hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mt-1" />
            <div className="text-sm">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Customer Account Only
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                This form is for customer accounts only. Admin and seller accounts are created by the system administrator.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
