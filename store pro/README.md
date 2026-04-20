# Professional Angular Store - Full Stack Application

A professional, production-ready e-commerce application built with **Angular 15** (traditional NgModule) and **Express.js + MongoDB**.

## 🎯 Features

### Frontend (Angular 15)

- **Traditional Architecture**: NgModule-based structure with constructor DI
- **Professional UI**: Modern, responsive design with custom CSS
- **Product Catalog**: Search, filter, and browse products with pagination
- **Shopping Cart**: Persistent cart with local storage
- **Authentication**: JWT-based user login and registration
- **User Profiles**: Order history and address management
- **Admin Dashboard**: Product and order management (admin-only)
- **HTTP Interceptors**: Automatic token handling and error management
- **Route Guards**: Protection for authenticated and admin routes

### Backend (Express.js + MongoDB)

- **RESTful API**: Clean endpoint structure
- **Authentication**: JWT-based authentication with password hashing (bcrypt)
- **Product Management**: CRUD operations with search and filtering
- **Order Management**: Order creation, tracking, and status updates
- **User Management**: Registration, login, profile updates
- **Middleware**: Auth, validation, and error handling
- **Pagination**: Efficient data retrieval
- **Input Validation**: Express-validator for request validation

## 📋 Prerequisites

- **Node.js**: v16+ ([Download](https://nodejs.org/))
- **MongoDB**: v4.4+
    - Local installation or MongoDB Atlas (cloud)
    - If using local: `mongod` should be running
- **npm**: v7+ (comes with Node.js)
- **Angular CLI**: v15 (optional, for CLI commands)

## 🚀 Quick Start

### 1. Clone/Extract the Project

```bash
cd c:\Users\ibenmadi\Desktop\docs\angular\angular-store-pro
```

### 2. Install Dependencies

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd backend
npm install
cd ..
```

### 3. Configure Environment

#### Backend (.env)

```bash
cd backend
copy .env.example .env
# Edit .env with your settings:
# - MONGODB_URI (change if not localhost)
# - JWT_SECRET (strong secret for production)
```

### 4. Start MongoDB

```bash
# Windows - if MongoDB is installed locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env with your connection string
```

### 5. Start the Application

#### Option A: Run Both (Recommended)

```bash
npm run start:all
```

- Backend: http://localhost:3001
- Frontend: http://localhost:4200

#### Option B: Run Separately

```bash
# Terminal 1: Backend
cd backend
npm start
# Server running at http://localhost:3001

# Terminal 2: Frontend
npm run start:frontend
# App opens at http://localhost:4200
```

## 📁 Project Structure

```
angular-store-pro/
├── src/                          # Angular Frontend
│   ├── app/
│   │   ├── services/            # Core services (Product, Cart, Auth, Order)
│   │   ├── guards/              # Route guards (Auth, Admin)
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── models/              # TypeScript interfaces
│   │   ├── modules/
│   │   │   ├── store/          # Store/Catalog module
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── profile/        # User profile module
│   │   │   └── admin/          # Admin dashboard module
│   │   ├── app.component.ts    # Main layout component
│   │   └── app.module.ts       # Root module
│   └── styles.css              # Global styles
│
├── backend/                      # Express.js Backend
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   └── category.routes.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   ├── server.js              # Express server entry point
│   └── package.json
│
├── package.json               # Root package.json
├── angular.json              # Angular config
├── tsconfig.json             # TypeScript config
└── proxy.conf.json           # Dev proxy config
```

## 🔑 Key Architecture Decisions

### Why Traditional NgModule Pattern?

- **Professional Standard**: Used in enterprise applications
- **Better Learning**: Understand dependency injection and module organization
- **Constructor-Based DI**: All services injected through constructor
- **No Standalone Components**: Following traditional Angular patterns
- **Real-World Ready**: Most existing codebases use this approach

### Backend Design

- **Separation of Concerns**: Models, Routes, Middleware
- **JWT Authentication**: Stateless auth for scalability
- **Mongoose ODM**: Schema validation and relationships
- **Express Middleware**: Flexible request processing
- **Error Handling**: Consistent error responses

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Products

- `GET /api/products` - List products (with pagination/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)

### Orders

- `GET /api/orders` - List all orders (admin)
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update status (admin)
- `PATCH /api/orders/:id/cancel` - Cancel order

## 📚 Services & Components

### Angular Services

- **ProductService**: Product CRUD and caching
- **CartService**: Cart management with localStorage
- **AuthService**: Authentication and JWT handling
- **OrderService**: Order management

### Angular Components

- **AppComponent**: Main layout with navbar and footer
- **StoreCatalogComponent**: Product listing with filtering
- **ProductCardComponent**: Reusable product card
- **CartComponent**: Shopping cart view
- **CheckoutComponent**: Order checkout (stub)
- **LoginComponent**: User authentication (stub)
- **AdminComponent**: Dashboard (stub)

## 🧪 Testing the Application

### Sample Users (After Seeding)

```
Admin:
Email: admin@store.com
Password: admin123

Customer:
Email: customer@store.com
Password: customer123
```

### Test Flow

1. Register new account or login with test account
2. Browse products on catalog page
3. Add products to cart
4. View cart and proceed to checkout
5. Create order
6. View order history in profile
7. (Admin) Access admin dashboard to manage products/orders

## 🛠️ Development

### Development Mode

```bash
# Frontend with hot reload
npm start

# Backend with nodemon
cd backend
npm run dev
```

### Build for Production

```bash
# Frontend
npm run build:prod
# Output in dist/

# Backend just copy files (or use Docker for deployment)
```

## 📝 Important Notes

### Local Storage

- **Cart**: Stored in browser's localStorage, persists across sessions
- **Auth Token**: Stored for automatic re-login
- **User Data**: Cached for quick access

### MongoDB Connection

If using local MongoDB:

```bash
# Make sure MongoDB service is running
mongod
```

If MongoDB not running, backend will fail to start.

### CORS Configuration

The proxy configuration in `proxy.conf.json` routes `/api` requests to `http://localhost:3001`

## 🎓 Learning Path

This project teaches:

1. **Angular 15 Fundamentals**: Modules, Components, Services
2. **Dependency Injection**: Constructor-based DI pattern
3. **HTTP Client**: API communication with interceptors
4. **RxJS**: Observables and operators
5. **Routing**: Nested routes and lazy loading
6. **Forms**: Template-driven and reactive forms
7. **Express.js**: REST APIs and middleware
8. **MongoDB**: Schema design and queries
9. **Authentication**: JWT and secure tokens
10. **Full Stack Architecture**: Frontend + Backend integration

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED
```

**Solution**: Start MongoDB or update MONGODB_URI in .env

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution**:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### npm install fails

```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Node modules issues

```bash
# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

## 📞 Support

For issues or questions:

1. Check the error message in browser console
2. Check backend console for API errors
3. Verify MongoDB is running
4. Ensure .env file is configured correctly

## 📄 License

This is a learning project. Feel free to modify and use for educational purposes.

---

**Built with ❤️ for learning professional Angular and Node.js development**
