# TaproBuy - E-Commerce Aggregator Platform

A complete, production-ready E-Commerce Aggregator Platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for Sri Lanka's multi-vendor marketplace.

## 🚀 Recent Updates & Fixes

### ✅ **FIXED ISSUES**
- **User Model**: Added `superadmin` role, `userId` field, and `mustChangePassword` flag
- **Authentication**: Fixed login to support both email (customers) and userId (admin/seller)
- **Role-Based Access**: Implemented proper RBAC with protected routes
- **Password Flow**: Added first-login password change requirement for admin/seller accounts
- **Backend Controllers**: Complete implementation of user management and auth controllers
- **Frontend Context**: Fixed AppContext with proper user state management
- **Protected Routes**: Added mustChangePassword flow handling

### 🔧 **COMPLETED FEATURES**
- **Super Admin Dashboard**: Complete user management system
- **Admin Dashboard**: Basic analytics and user overview
- **User Management**: CRUD operations with role-based permissions
- **Authentication Flow**: Login, logout, password change, and session management
- **Role-Based UI**: Different interfaces for each user role
- **Security**: JWT tokens, password hashing, input validation

## 👥 User Roles & Access Control

### **Super Admin** (Pre-seeded)
- **Access**: `/superadmin` dashboard
- **Capabilities**: Create/delete admin & seller accounts, manage all users
- **Default Credentials**: `superadmin` / `superadmin123`

### **Admin**
- **Access**: `/admin` dashboard
- **Capabilities**: View analytics, manage products, moderate orders
- **Creation**: Created by Super Admin with temporary password

### **Seller**
- **Access**: Product management, order tracking, sales analytics
- **Capabilities**: Add/edit products, manage inventory, view sales
- **Creation**: Created by Super Admin with temporary password

### **Customer**
- **Access**: Public signup, shopping, cart, checkout
- **Capabilities**: Browse products, make purchases, track orders
- **Registration**: Self-registration via public signup form

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API
- **MongoDB** + **Mongoose** - Database with proper indexing
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React.js 18** - UI framework with hooks
- **TypeScript** - Type safety
- **React Router** - Navigation & protected routes
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client with interceptors

## 📁 Project Structure

```
TaproBuy/
├── server/                 # Node.js backend
│   ├── config/            # Database & app config
│   ├── controllers/       # Route controllers (COMPLETE)
│   ├── middleware/        # Auth & error handling
│   ├── models/            # MongoDB schemas (UPDATED)
│   ├── routes/            # API routes (ENHANCED)
│   ├── scripts/           # Database seeding
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point (FIXED)
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # App state management (FIXED)
│   │   ├── services/      # API services
│   │   └── utils/         # Helper functions
│   └── package.json
├── env.example            # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone & Install
```bash
git clone <repository-url>
cd TaproBuy

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cd ../server
cp env.example .env

# Edit .env with your values
nano .env
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/taprobuy

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Server
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Seed Super Admin (in server directory)
npm run seed
```

**Super Admin Credentials:**
- **User ID**: `superadmin`
- **Password**: `superadmin123`
- **Email**: `superadmin@taprobuy.com`

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 🔐 Authentication Flow

### **First-Time Setup**
1. Run `npm run seed` to create super admin
2. Login with super admin credentials
3. Create admin/seller accounts via dashboard

### **Admin/Seller First Login**
1. Login with temporary password (shown in creation response)
2. System automatically shows password change form
3. Must change password before accessing dashboard

### **Customer Registration**
1. Navigate to `/register`
2. Fill in name, email, and password
3. Account automatically activated

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (supports email & userId)
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/setup-superadmin` - Initial super admin setup
- `PUT /api/auth/updatepassword` - Change password
- `GET /api/auth/me` - Get current user

### User Management (Protected)
- `GET /api/users` - List users (Admin/SuperAdmin)
- `POST /api/users` - Create user (SuperAdmin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user (SuperAdmin only)
- `PUT /api/users/:id/reset-password` - Reset password (SuperAdmin only)

### Health Check
- `GET /api/health` - API status

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### Manual Testing Scenarios
1. **Super Admin Flow**
   - Login → Create Admin → Create Seller → Manage Users

2. **Admin Flow**
   - Login with temp password → Change password → Access dashboard

3. **Seller Flow**
   - Login with temp password → Change password → Access features

4. **Customer Flow**
   - Register → Login → Browse → Cart → Checkout

## 🚀 Deployment

### Backend (Render/Heroku)
```bash
# Set environment variables
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret
NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy build folder
```

### Database (MongoDB Atlas)
1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGODB_URI` in production environment

## 🔒 Security Features

- **JWT Authentication** with role-based access control
- **Password Hashing** using bcryptjs
- **Input Validation** with Mongoose schemas
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Helmet Security Headers**
- **Environment Variable Protection**

## 📈 Performance Optimizations

- **Database Indexing** on frequently queried fields
- **Pagination** for large datasets
- **Compression** middleware for responses
- **Lazy Loading** for frontend components
- **Code Splitting** for better bundle management

## 🐛 Known Issues & Limitations

### **Current Limitations**
- Email functionality not implemented (password reset)
- File upload system not connected
- Payment gateway integration pending
- Real-time notifications not implemented

### **Planned Features**
- Email service integration
- File upload with Cloudinary
- Payment processing with PayHere
- Real-time chat support
- Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Email**: support@taprobuy.com
- **Issues**: GitHub repository issues
- **Documentation**: This README and inline code comments

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 **Next Steps for Development**

1. **Implement Email Service** for password reset
2. **Add File Upload** functionality
3. **Connect Payment Gateway** (PayHere)
4. **Build Product Management** system
5. **Implement Order Processing** workflow
6. **Add Real-time Features** (chat, notifications)
7. **Performance Testing** and optimization
8. **Security Audit** and penetration testing

**Current Status**: ✅ **Core Authentication & User Management Complete**
**Next Milestone**: 🚧 **Product Management System**
