import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import CategoryProducts from './pages/CategoryProducts';
import CategoryDemo from './pages/CategoryDemo';
import Categories from './pages/Categories';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:category" element={<CategoryProducts />} />
            <Route path="/category-demo" element={<CategoryDemo />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute requireRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute requireRole="superadmin" />}>
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
            </Route>
            
            <Route path="*" element={<div className="text-center py-20">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
