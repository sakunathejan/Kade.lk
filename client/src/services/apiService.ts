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
    const res = await api.get('/products', { params: { page, limit } });
    return res.data;
  }

  async getUsers(page = 1, limit = 5) {
    const res = await api.get('/users', { params: { page, limit } });
    return res.data;
  }

  async getOrders(page = 1, limit = 5) {
    const res = await api.get('/orders', { params: { page, limit } });
    return res.data;
  }

  calculatePublicAnalytics(productsData: any, usersData: any, ordersData: any): Analytics {
    return {
      totalProducts: productsData.totalProducts,
      totalCustomers: usersData.users.filter((user: User) => user.role === 'customer').length,
      totalOrders: ordersData.totalOrders
    };
  }

  calculateAdminAnalytics(productsData: any, usersData: any, ordersData: any): Analytics {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyOrders = ordersData.orders.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
    const newUsersThisMonth = usersData.users.filter((user: User) => {
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
    }).length;

    const totalRevenue = ordersData.orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
    const averageOrderValue = ordersData.totalOrders > 0 ? totalRevenue / ordersData.totalOrders : 0;

    return {
      totalUsers: usersData.totalUsers,
      totalCustomers: usersData.users.filter((user: User) => user.role === 'customer').length,
      totalProducts: productsData.totalProducts,
      monthlyRevenue,
      ordersThisMonth: monthlyOrders.length,
      newUsersThisMonth,
      totalOrders: ordersData.totalOrders,
      averageOrderValue,
      totalRevenue
    };
  }

  // login moved to context via http client
}

export const apiService = new RealTimeAPIService();
