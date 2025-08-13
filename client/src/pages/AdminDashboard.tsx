import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

interface AdminStats {
  totalUsers?: number;
  totalCustomers?: number;
  totalProducts?: number;
  monthlyRevenue?: number;
  ordersThisMonth?: number;
  newUsersThisMonth?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  totalRevenue?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    (async () => {
      const products = await apiService.getProducts(1, 100);
      const users = await apiService.getUsers(1, 100);
      const orders = await apiService.getOrders(1, 100);
      const computed = apiService.calculateAdminAnalytics(products, users, orders);
      setStats(computed);
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      {!stats ? (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Total Users: {stats.totalUsers}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Total Customers: {stats.totalCustomers}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Total Products: {stats.totalProducts}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Monthly Revenue: Rs. {stats.monthlyRevenue?.toLocaleString()}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Orders This Month: {stats.ordersThisMonth}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">New Users This Month: {stats.newUsersThisMonth}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Total Orders: {stats.totalOrders}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Average Order Value: Rs. {stats.averageOrderValue?.toFixed(0)}</div>
          <div className="bg-white border rounded p-4 dark:bg-gray-900 dark:border-gray-700">Total Revenue: Rs. {stats.totalRevenue?.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


