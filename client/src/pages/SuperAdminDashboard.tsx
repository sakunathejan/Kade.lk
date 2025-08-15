import React, { useState, useEffect } from 'react';
import { useAppContext, User } from '../context/AppContext';
import { motion } from 'framer-motion';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService';
import ProductManagement from '../components/admin/ProductManagement';

const SuperAdminDashboard: React.FC = () => {
  const { state, getUsers, createUser, updateUser, deleteUser, activateUser, deactivateUser, hardDeleteUser } = useAppContext();
  const { user } = state;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    sellers: 0,
    customers: 0
  });

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    userId: '',
    role: 'admin' as 'admin' | 'seller'
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      const userData = response;
      setUsers(Array.isArray(userData) ? userData : []);
      
      // Calculate stats
      const stats = {
        total: userData.length,
        admins: userData.filter((u: User) => u.role === 'admin').length,
        sellers: userData.filter((u: User) => u.role === 'seller').length,
        customers: userData.filter((u: User) => u.role === 'customer').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    // Validation
    if (!createForm.name || !createForm.email || !createForm.userId) {
      setErrors(['Please fill in all required fields']);
      return;
    }

    try {
      // Create user first
      const userResponse = await createUser({
        name: createForm.name,
        email: createForm.email,
        userId: createForm.userId,
        role: createForm.role
      });

      console.log('🔍 User creation response:', userResponse);
      console.log('🔍 Temp password from response:', (userResponse as any)?.data?.tempPassword || (userResponse as any)?.tempPassword);

      // Send welcome email with temporary password
      try {
        const emailResult = await sendWelcomeEmail({
          to_email: createForm.email,
          to_name: createForm.name,
          user_id: createForm.userId,
          temp_password: (userResponse as any)?.data?.tempPassword || (userResponse as any)?.tempPassword || 'Password not generated',
          role: createForm.role
        });

        if (emailResult.success) {
          setSuccess('User created successfully! Welcome email sent with temporary password.');
        } else {
          setSuccess('User created successfully! But email failed to send. Check console for details.');
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        setSuccess('User created successfully! But email failed to send. Check console for details.');
      }

      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        userId: '',
        role: 'admin'
      });
      loadUsers();
    } catch (error: any) {
      setErrors([error.message || 'Failed to create user']);
    }
  };

  const handlePasswordReset = async (user: User) => {
    if (window.confirm(`Are you sure you want to reset the password for ${user.name}?`)) {
      try {
        setErrors([]);
        setSuccess('');

        // Call the password reset endpoint
        const response = await fetch(`/api/users/${user.id}/reset-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            newPassword: '' // Empty to generate random password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to reset password');
        }

        const result = await response.json();
        const newPassword = result.data?.tempPassword || 'Password generated';

        // Send password reset email
        const emailResult = await sendPasswordResetEmail({
          to_email: user.email,
          to_name: user.name,
          user_id: user.userId,
          temp_password: newPassword,
          role: user.role
        });

        if (emailResult.success) {
          setSuccess(`Password reset successfully! Reset email sent to ${user.email}`);
        } else {
          setSuccess(`Password reset successfully! But email failed to send. Check console for details.`);
        }

        loadUsers(); // Refresh user list
      } catch (error: any) {
        setErrors([error.message || 'Failed to reset password']);
      }
    }
  };

  const handleActivateUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to activate this user?')) {
      try {
        await activateUser(userId);
        setSuccess('User activated successfully');
        loadUsers();
      } catch (error: any) {
        setErrors([error.message || 'Failed to activate user']);
      }
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to deactivate this user? (User will remain in database but inactive)')) {
      try {
        await deactivateUser(userId);
        setSuccess('User deactivated successfully');
        loadUsers();
      } catch (error: any) {
        setErrors([error.message || 'Failed to deactivate user']);
      }
    }
  };

  const handleHardDeleteUser = async (userId: string) => {
    if (window.confirm('⚠️ WARNING: This will PERMANENTLY DELETE the user from the database. This action cannot be undone. Are you absolutely sure?')) {
      try {
        await hardDeleteUser(userId);
        setSuccess('User permanently deleted from database');
        loadUsers();
      } catch (error: any) {
        setErrors([error.message || 'Failed to delete user']);
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'seller': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'customer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <span className="text-sm">🛡️</span>;
      case 'admin': return <span className="text-sm">👥</span>;
      case 'seller': return <span className="text-sm">✏️</span>;
      case 'customer': return <span className="text-sm">➕</span>;
      default: return <span className="text-sm">👥</span>;
    }
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
                Super Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage users, products and system settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Product Management
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'users' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="text-2xl text-blue-600 dark:text-blue-400">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="text-2xl text-blue-600 dark:text-blue-400">🛡️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.admins}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <span className="text-2xl text-green-600 dark:text-green-400">✏️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sellers</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.sellers}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <span className="text-2xl text-purple-600 dark:text-purple-400">➕</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.customers}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ▶️ Activate | ⏸️ Deactivate | 🗑️ Permanently delete from database
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="text-sm mr-2">➕</span>
                Create User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              ID: {user.userId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {user.mustChangePassword && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Password Change Required
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePasswordReset(user)}
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                            title="Reset Password"
                          >
                            <span className="text-sm">🔄</span>
                          </button>
                          {user.isActive ? (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Deactivate User"
                            >
                              <span className="text-sm">⏸️</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Activate User"
                            >
                              <span className="text-sm">▶️</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleHardDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Permanently Delete User"
                          >
                            <span className="text-sm">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New User</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User ID *
                    </label>
                    <input
                      type="text"
                      value={createForm.userId}
                      onChange={(e) => setCreateForm({ ...createForm, userId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter user ID"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role *
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'admin' | 'seller' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <ProductManagement />
      )}

      {/* Success/Error Messages - Global */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50"
        >
          <div className="flex items-center">
            <span className="text-sm mr-2">✅</span>
            {success}
          </div>
        </motion.div>
      )}

      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50"
        >
          <div className="flex items-center">
            <span className="text-sm mr-2">❌</span>
            <ul className="ml-2">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
