const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Sri Lanka'
    }
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  paymentInfo: {
    id: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    type: {
      type: String,
      enum: ['payhere', 'cod'],
      default: 'payhere'
    },
    paidAt: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  commission: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'processing'
  },
  deliveredAt: Date,
  cancelledAt: Date,
  refundRequested: {
    type: Boolean,
    default: false
  },
  refundReason: String,
  refundStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ 'orderItems.seller': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
