import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { SRI_LANKA_BANKS } from '../utils/banks';

const Checkout: React.FC = () => {
  const { state } = useAppContext();
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    nicNumber: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: '',
    city: '',
    postalCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    console.log('Checkout form submitted:', formData);
  };

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container-3d max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
          Complete Your Order
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card card--elevated p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {state.cart.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-[color:var(--color-primary)]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-[color:var(--color-primary)]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <motion.button
              type="submit"
              form="checkout-form"
              className="w-full btn btn-primary mt-6 text-lg py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-credit-card mr-2" />
              Complete Payment
            </motion.button>
          </div>
        </motion.div>

        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Bank Transfer Details */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fa-solid fa-university mr-3 text-[color:var(--color-primary)]" />
                Bank Transfer Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name *</label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a bank</option>
                    {SRI_LANKA_BANKS.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account Number *</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account Holder Name *</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter account holder name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">NIC Number *</label>
                  <input
                    type="text"
                    name="nicNumber"
                    value={formData.nicNumber}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter NIC number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fa-solid fa-user mr-3 text-[color:var(--color-accent)]" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <i className="fa-solid fa-truck mr-3 text-[color:var(--color-secondary)]" />
                Delivery Address
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    className="input w-full h-24 resize-none"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;


