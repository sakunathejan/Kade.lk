const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import User model
const User = require('../models/User');

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected for seeding...');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists. Skipping...');
      process.exit(0);
    }

    // Create super admin user
    const superAdminData = {
      userId: 'superadmin',
      name: 'Super Administrator',
      email: 'superadmin@taprobuy.com',
      password: 'superadmin123', // This will be hashed by the pre-save hook
      role: 'superadmin',
      isVerified: true,
      isActive: true,
      mustChangePassword: false
    };

    const superAdmin = await User.create(superAdminData);

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🆔 User ID:', superAdmin.userId);
    console.log('🔑 Password: superadmin123');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('You can now login with:');
    console.log('User ID: superadmin');
    console.log('Password: superadmin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
    process.exit(1);
  }
};

// Run the seeder
seedSuperAdmin();
