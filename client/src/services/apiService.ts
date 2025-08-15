// Note: This file previously returned mock data. We'll keep
// lightweight types here but migrate calls to the real HTTP client.
import { api } from './http';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'customer';
  createdAt: string;
  isActive: boolean;
}

interface Order {
  _id: string;
  userId: string;
  customerName: string;
  products: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Analytics {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalUsers?: number;
  monthlyRevenue?: number;
  ordersThisMonth?: number;
  newUsersThisMonth?: number;
  averageOrderValue?: number;
  totalRevenue?: number;
}

class RealTimeAPIService {
  private dataCache = new Map<string, any>();

  async getProducts(page = 1, limit = 10) {
    const res = await api.get('/api/products', { params: { page, limit } });
    return res.data;
  }

  async getUsers(page = 1, limit = 5) {
    const res = await api.get('/api/users', { params: { page, limit } });
    return res.data;
  }

  async getOrders(page = 1, limit = 5) {
    const res = await api.get('/api/orders', { params: { page, limit } });
    return res.data;
  }

  calculatePublicAnalytics(productsData: any, usersData: any, ordersData: any): Analytics {
    // Add null checks and provide fallbacks
    if (!productsData || !usersData || !ordersData) {
      console.warn('Missing data for public analytics calculation:', { productsData, usersData, ordersData });
      return {
        totalProducts: 0,
        totalCustomers: 0,
        totalOrders: 0
      };
    }

    // Safely access users array with fallback
    const users = Array.isArray(usersData.users) ? usersData.users : 
                  Array.isArray(usersData.data) ? usersData.data : 
                  Array.isArray(usersData) ? usersData : [];

    return {
      totalProducts: productsData.totalProducts || productsData.data?.length || 0,
      totalCustomers: users.filter((user: User) => user?.role === 'customer').length,
      totalOrders: ordersData.totalOrders || ordersData.data?.length || 0
    };
  }

  calculateAdminAnalytics(productsData: any, usersData: any, ordersData: any): Analytics {
    // Add null checks and provide fallbacks
    if (!productsData || !usersData || !ordersData) {
      console.warn('Missing data for analytics calculation:', { productsData, usersData, ordersData });
      return {
        totalProducts: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalUsers: 0,
        monthlyRevenue: 0,
        ordersThisMonth: 0,
        newUsersThisMonth: 0,
        averageOrderValue: 0,
        totalRevenue: 0
      };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Safely access orders array with fallback
    const orders = Array.isArray(ordersData.orders) ? ordersData.orders : 
                   Array.isArray(ordersData.data) ? ordersData.data : 
                   Array.isArray(ordersData) ? ordersData : [];
    
    // Safely access users array with fallback
    const users = Array.isArray(usersData.users) ? usersData.users : 
                  Array.isArray(usersData.data) ? usersData.data : 
                  Array.isArray(usersData) ? usersData : [];
    
    // Handle empty arrays gracefully
    if (orders.length === 0) {
      console.log('No orders found, returning default analytics');
      return {
        totalUsers: usersData.totalUsers || users.length || 0,
        totalCustomers: users.filter((user: User) => user?.role === 'customer').length,
        totalProducts: productsData.totalProducts || productsData.data?.length || 0,
        monthlyRevenue: 0,
        ordersThisMonth: 0,
        newUsersThisMonth: users.filter((user: User) => {
          if (!user || !user.createdAt) return false;
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length,
        totalOrders: 0,
        averageOrderValue: 0,
        totalRevenue: 0
      };
    }
    
    const monthlyOrders = orders.filter((order: Order) => {
      if (!order || !order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyOrders.reduce((sum: number, order: Order) => {
      return sum + (order?.totalAmount || 0);
    }, 0);
    
    const newUsersThisMonth = users.filter((user: User) => {
      if (!user || !user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
    }).length;

    const totalRevenue = orders.reduce((sum: number, order: Order) => {
      return sum + (order?.totalAmount || 0);
    }, 0);
    
    const totalOrders = ordersData.totalOrders || orders.length || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalUsers: usersData.totalUsers || users.length || 0,
      totalCustomers: users.filter((user: User) => user?.role === 'customer').length,
      totalProducts: productsData.totalProducts || productsData.data?.length || 0,
      monthlyRevenue,
      ordersThisMonth: monthlyOrders.length,
      newUsersThisMonth,
      totalOrders,
      averageOrderValue,
      totalRevenue
    };
  }

  // login moved to context via http client
}

export const apiService = new RealTimeAPIService();
