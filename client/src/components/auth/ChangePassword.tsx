import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';


interface ChangePasswordProps {
  onSuccess?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onSuccess }) => {
  const { changePassword } = useAppContext();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setSuccess('Password changed successfully!');
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Call success callback if provided
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full p-6"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <i className="fa-solid fa-key text-2xl text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Change Password Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            For security reasons, you must change your password on first login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
              Current Password *
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="input w-full pl-12 pr-12"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.currentPassword ? (
                  <span className="text-xs">🙈</span>
                ) : (
                  <span className="text-xs">👁️</span>
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              New Password *
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="input w-full pl-12 pr-12"
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.newPassword ? (
                  <span className="text-xs">🙈</span>
                ) : (
                  <span className="text-xs">👁️</span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input w-full pl-12 pr-12"
                placeholder="Confirm new password"
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
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200 text-sm">{success}</span>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Changing Password...
              </>
            ) : (
              <>
                <i className="fa-solid fa-key mr-2" />
                Change Password
              </>
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-shield-halved text-blue-600 dark:text-blue-400 mt-1" />
            <div className="text-sm">
              <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Security Reminder
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                Choose a strong, unique password that you don't use elsewhere. This helps protect your account and the platform.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
