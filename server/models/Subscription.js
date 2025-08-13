const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 30 // days
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  paymentId: String,
  features: [{
    type: String,
    enum: [
      'featured_listings',
      'analytics',
      'priority_support',
      'bulk_upload',
      'custom_branding',
      'api_access'
    ]
  }],
  usage: {
    featuredListings: {
      type: Number,
      default: 0
    },
    totalListings: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
