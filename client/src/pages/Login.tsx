import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const Login: React.FC = () => {
  const { state, login } = useAppContext();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'email' | 'userId'>('email');
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!state.isInitializing && state.isAuthenticated) {
      navigate('/');
    }
  }, [state.isAuthenticated, state.isInitializing, navigate]);

  // Show loading while checking authentication
  if (state.isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (state.isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loginIdentifier = loginType === 'email' ? formData.email : formData.userId;
    
    if (!loginIdentifier || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(loginIdentifier, formData.password);
    navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginTypeChange = (type: 'email' | 'userId') => {
    setLoginType(type);
    setError('');
    // Clear the other field when switching types
    if (type === 'email') {
      setFormData(prev => ({ ...prev, userId: '' }));
    } else {
      setFormData(prev => ({ ...prev, email: '' }));
    }
  };

  return (
    <div className="container-3d min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
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
          <p className="text-muted text-lg">Welcome back! Sign in to your account</p>
        </motion.div>

        {/* Login Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <motion.button
              type="button"
              onClick={() => handleLoginTypeChange('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'email'
                  ? 'bg-white dark:bg-gray-700 text-[color:var(--color-primary)] shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-envelope mr-2" />
              Customer Login
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleLoginTypeChange('userId')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'userId'
                  ? 'bg-white dark:bg-gray-700 text-[color:var(--color-primary)] shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-user-shield mr-2" />
              Admin/Seller Login
            </motion.button>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Identifier Field */}
        <div>
              <label htmlFor={loginType} className="block text-sm font-medium mb-2">
                {loginType === 'email' ? 'Email Address' : 'User ID'} *
              </label>
              <div className="relative">
                <i className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-muted ${
                  loginType === 'email' ? 'fa-solid fa-envelope' : 'fa-solid fa-user'
                }`}></i>
          <input
                  type={loginType === 'email' ? 'email' : 'text'}
                  id={loginType}
                  name={loginType}
                  value={loginType === 'email' ? formData.email : formData.userId}
                  onChange={handleInputChange}
                  className="input w-full pl-12"
                  placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your user ID'}
                  required
                  autoComplete={loginType === 'email' ? 'email' : 'username'}
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
            type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input w-full pl-12 pr-12"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
          />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
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
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-sign-in-alt mr-2" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-4 text-sm text-muted">or</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <p className="text-sm text-muted text-center mb-4">
              Try these demo accounts:
            </p>
            
            <motion.button
              onClick={() => {
                handleLoginTypeChange('userId');
                setFormData({ email: '', userId: 'admin001', password: 'admin123' });
              }}
              className="w-full btn btn-outline text-sm py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-user-shield mr-2" />
              Admin Account (admin001 / admin123)
            </motion.button>
            
            <motion.button
              onClick={() => {
                handleLoginTypeChange('userId');
                setFormData({ email: '', userId: 'seller001', password: 'seller123' });
              }}
              className="w-full btn btn-outline text-sm py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-store mr-2" />
              Seller Account (seller001 / seller123)
            </motion.button>
            
            <motion.button
              onClick={() => {
                handleLoginTypeChange('email');
                setFormData({ email: 'customer@example.com', userId: '', password: 'customer123' });
              }}
              className="w-full btn btn-outline text-sm py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-user mr-2" />
              Customer Account (customer@example.com / customer123)
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-muted">
            Don't have an account?{' '}
            <motion.a
              href="/register"
              className="text-[color:var(--color-primary)] hover:underline font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign up here
            </motion.a>
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-shield-halved text-blue-600 dark:text-blue-400 mt-1" />
            <div className="text-sm">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Secure Login
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                Your credentials are encrypted and secure. We never store passwords in plain text.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;


