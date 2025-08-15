import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/http';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CubeIcon, 
  ShoppingCartIcon, 
  TagIcon, 
  EnvelopeIcon, 
  ChartPieIcon, 
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Import management components
import OrderManagement from '../components/admin/OrderManagement';
import CategoryManagement from '../components/admin/CategoryManagement';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  ordersThisMonth: number;
  newUsersThisMonth: number;
  averageOrderValue: number;
  roleDistribution: {
    admins: number;
    sellers: number;
    customers: number;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  stock: number;
  isActive: boolean;
  seller: { name: string; _id: string };
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{ product: string; quantity: number; price: number }>;
}

interface Category {
  _id: string;
  name: string;
  icon: string;
  subcategories: string[];
  isActive: boolean;
}

const AdminDashboard: React.FC = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders' | 'categories' | 'emails' | 'reports' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [usersRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/products'),
        api.get('/api/orders'),
        api.get('/api/categories')
      ]);

      const usersData = usersRes.data.data || [];
      const productsData = productsRes.data.data || [];
      const ordersData = ordersRes.data.data || [];
      const categoriesData = categoriesRes.data.data || [];

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyOrders = ordersData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });

      const monthlyRevenue = monthlyOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
      const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
      const averageOrderValue = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;

      const newUsersThisMonth = usersData.filter((user: User) => {
        const userDate = new Date(user.createdAt);
        return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
      }).length;

      const roleDistribution = {
        admins: usersData.filter((u: User) => u.role === 'admin').length,
        sellers: usersData.filter((u: User) => u.role === 'seller').length,
        customers: usersData.filter((u: User) => u.role === 'customer').length
      };

      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        monthlyRevenue,
        ordersThisMonth: monthlyOrders.length,
        newUsersThisMonth,
        averageOrderValue,
        roleDistribution
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Filter and pagination logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.isActive === (filterStatus === 'active');
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
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
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your e-commerce platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <BellIcon className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Welcome, {state.user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'users', name: 'Users', icon: UsersIcon },
              { id: 'products', name: 'Products', icon: CubeIcon },
              { id: 'orders', name: 'Orders', icon: ShoppingCartIcon },
              { id: 'categories', name: 'Categories', icon: TagIcon },
              { id: 'emails', name: 'Emails', icon: EnvelopeIcon },
              { id: 'reports', name: 'Reports', icon: ChartPieIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: 'blue' },
                { label: 'Total Products', value: stats?.totalProducts || 0, icon: CubeIcon, color: 'green' },
                { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCartIcon, color: 'purple' },
                { label: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: ChartBarIcon, color: 'indigo' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Role Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Role Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { role: 'Admins', count: stats?.roleDistribution.admins || 0, color: 'blue' },
                  { role: 'Sellers', count: stats?.roleDistribution.sellers || 0, color: 'green' },
                  { role: 'Customers', count: stats?.roleDistribution.customers || 0, color: 'purple' }
                ].map((item) => (
                  <div key={item.role} className="text-center">
                    <div className={`text-3xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
                      {item.count}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                  { action: 'Product added to inventory', time: '15 minutes ago', type: 'product' },
                  { action: 'Order #12345 placed', time: '1 hour ago', type: 'order' },
                  { action: 'Category updated', time: '2 hours ago', type: 'category' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{activity.action}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Users Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
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
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            user.role === 'seller' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <OrderManagement />
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CategoryManagement />
          </motion.div>
        )}

        {/* Add other tabs here - Products, Emails, Reports, Settings */}
        {!['overview', 'users', 'orders', 'categories'].includes(activeTab) && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab} management features coming soon...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


