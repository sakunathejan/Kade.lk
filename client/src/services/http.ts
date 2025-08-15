import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not on login page to avoid infinite loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Export mock API for testing purposes (not used in production)
export const mockApi = {
  // Mock login
  login: async (userId: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers = [
      {
        _id: '1',
        userId: 'admin001',
        email: 'admin@taprobuy.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        userId: 'seller001',
        email: 'seller@taprobuy.com',
        name: 'Seller User',
        role: 'seller',
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        userId: 'superadmin',
        email: 'superadmin@taprobuy.com',
        name: 'Super Admin',
        role: 'superadmin',
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    const user = mockUsers.find(u => 
      (u.userId === userId || u.email === userId)
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      data: {
        token: `mock-jwt-token-${user._id}`,
        user: user
      }
    };
  }
};


