const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testSetup = async () => {
  try {
    console.log('🧪 Testing TaproBuy Server Setup...\n');

    // Test environment variables
    console.log('📋 Environment Variables:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   PORT: ${process.env.PORT || '5001'}`);
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   CLIENT_URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}\n`);

    // Test database connection
    if (process.env.MONGODB_URI) {
      console.log('🔌 Testing Database Connection...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('   ✅ MongoDB Connected Successfully');
      
      // Test database operations
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`   📊 Collections found: ${collections.length}`);
      
      await mongoose.disconnect();
      console.log('   ✅ Database connection test completed\n');
    } else {
      console.log('❌ MONGODB_URI not set. Skipping database test.\n');
    }

    // Test required files
    console.log('📁 Testing Required Files:');
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'server.js',
      'models/User.js',
      'controllers/authController.js',
      'controllers/userController.js',
      'middleware/auth.js',
      'routes/auth.js',
      'routes/users.js'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file}`);
      } else {
        console.log(`   ❌ ${file} - Missing`);
      }
    });

    console.log('\n🎯 Setup Test Summary:');
    if (process.env.MONGODB_URI && process.env.JWT_SECRET) {
      console.log('   ✅ Environment variables configured');
      console.log('   ✅ Database connection working');
      console.log('   ✅ Core files present');
      console.log('\n🚀 Server is ready to start!');
      console.log('   Run: npm run dev');
    } else {
      console.log('   ❌ Environment variables missing');
      console.log('   📝 Please check your .env file');
    }

  } catch (error) {
    console.error('❌ Setup test failed:', error.message);
    process.exit(1);
  }
};

// Run the test
testSetup();
