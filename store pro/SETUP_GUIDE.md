# 🎓 Angular Store Pro - Complete Setup Guide

Welcome! This guide will walk you through setting up and running the Professional Angular 15 Store application.

## ✅ Prerequisites Checklist

Before you start, verify you have:

- [ ] Node.js v16+ installed ([Download](https://nodejs.org/))
- [ ] npm v7+ installed (comes with Node.js)
- [ ] MongoDB running locally or MongoDB Atlas account
- [ ] VS Code or any code editor
- [ ] About 15 minutes to complete setup

**Verify installations:**

```bash
node --version
npm --version
```

---

## 📦 Step 1: Install Dependencies

### Frontend Dependencies

```bash
# Navigate to project root (if not already there)
cd c:\Users\ibenmadi\Desktop\docs\angular\angular-store-pro

# Install frontend packages
npm install
```

### Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install backend packages
npm install

# Return to project root
cd ..
```

**Expected outcome**: Two `node_modules` folders created (one in root, one in backend)

---

## 🗄️ Step 2: Set Up MongoDB

### Option A: Local MongoDB Installation

1. **Download MongoDB Community Edition**
    - Visit: https://www.mongodb.com/try/download/community
    - Download and install

2. **Start MongoDB**
    ```bash
    # Windows Command Prompt
    mongod
    ```

    - Should show: `"Waiting for connections on port 27017"`

### Option B: MongoDB Atlas (Cloud)

1. **Create free account**: https://www.mongodb.com/cloud/atlas
2. **Create cluster** (free tier available)
3. **Get connection string**: `mongodb+srv://username:password@cluster.mongodb.net/angular-store-pro`
4. Copy this for backend `.env` file

---

## ⚙️ Step 3: Configure Backend

```bash
# Navigate to backend
cd backend

# Copy environment template
copy .env.example .env
```

### Edit `backend/.env`:

**If using Local MongoDB:**

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/angular-store-pro
JWT_SECRET=your-super-secret-key-change-this
SERVER_HOST=localhost
```

**If using MongoDB Atlas:**

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/angular-store-pro
JWT_SECRET=your-super-secret-key-change-this
SERVER_HOST=localhost
```

---

## 🚀 Step 4: Start the Application

### Method 1: Start Everything at Once (Recommended)

```bash
# Make sure you're in project root
cd c:\Users\ibenmadi\Desktop\docs\angular\angular-store-pro

# Start both backend and frontend
npm run start:all
```

This will:

- Start backend on `http://localhost:3000`
- Start frontend on `http://localhost:4200`
- Automatically open your browser

### Method 2: Start Separately

**Terminal 1 - Backend:**

```bash
cd backend
npm start
# Output: "🚀 Server running on http://localhost:3000"
```

**Terminal 2 - Frontend:**

```bash
npm run start:frontend
# Browser opens at http://localhost:4200
```

---

## 🎯 Step 5: Test the Application

### First Time Setup

1. **Open browser**: http://localhost:4200
2. **See the home page** with product catalog (may show "No products found" initially)

### Try These Actions:

#### 1. Register New Account

- Click "Login" in navbar
- Click "Register"
- Fill in:
    - Email: `test@example.com`
    - First Name: `John`
    - Last Name: `Doe`
    - Password: `password123`
- Click "Register"
- You should be logged in

#### 2. Browse Products (After Seeding)

- Click "Catalog"
- Use filters to search
- Add products to cart
- View cart via cart icon

#### 3. Make an Order

- Add items to cart
- Click cart icon
- Proceed to checkout
- Complete order

#### 4. Admin Access (If you set admin role)

- Login with admin account
- Navigate to `/admin`
- Manage products and orders

---

## 📊 API Testing with curl

Test the backend API directly:

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"password\":\"password123\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"password123\"}"
```

### Get Products

```bash
curl http://localhost:3000/api/products?limit=10&offset=0
```

---

## 🛠️ Development vs Production

### Development Mode (For Learning)

```bash
npm start          # Frontend with hot reload
cd backend && npm run dev  # Backend with nodemon
```

### Production Build

```bash
# Frontend
npm run build:prod
# Creates optimized build in dist/ folder
```

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Error

```
Error: connect ECONNREFUSED
MongooseError: Cannot connect to MongoDB
```

**Fix:**

- Make sure `mongod` is running
- If using Atlas, check your connection string in .env
- Verify MongoDB URI is correct

### Issue 2: Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Fix:**

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill the process (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

### Issue 3: npm install Fails

```
Error: npm ERR! code ERESOLVE
```

**Fix:**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Auth Token Not Working

```
Error: Invalid or expired token
```

**Fix:**

- Clear browser localStorage: Press F12 → Application → Local Storage → Clear All
- Login again

### Issue 5: Proxy Not Working

```
Error: 404 Not Found (on /api calls)
```

**Fix:**

- Check proxy.conf.json exists
- Make sure backend is running on port 3000
- Check browser console for actual error

---

## 📚 Learning Resources

### Understanding the Architecture

1. **Read first:** `README.md` (project overview)
2. **Explore:** Project structure in file explorer
3. **Frontend code:** `src/app/` - study components and services
4. **Backend code:** `backend/` - study routes and models

### Key Files to Study

**Frontend:**

- `src/app/app.module.ts` - Main module (traditional approach)
- `src/app/services/auth.service.ts` - Authentication logic
- `src/app/modules/store/` - Store module (lazy loaded)
- `src/app/guards/` - Route protection

**Backend:**

- `backend/server.js` - Express setup
- `backend/models/` - MongoDB schemas
- `backend/routes/` - API endpoints
- `backend/middleware/auth.js` - JWT verification

---

## 🎓 Next Steps for Learning

### Week 1: Understand the Structure

- [ ] Explore the Angular module architecture
- [ ] Understand NgModule vs Standalone Components
- [ ] Study the service layer
- [ ] Review the Express routes

### Week 2: Modify Components

- [ ] Add UI improvements to the catalog
- [ ] Create proper cart component
- [ ] Implement checkout form
- [ ] Add order history page

### Week 3: Backend Enhancement

- [ ] Add product reviews
- [ ] Implement payment processing (mock)
- [ ] Add email notifications
- [ ] Create admin dashboard

### Week 4: Production Ready

- [ ] Add error boundaries
- [ ] Implement logging
- [ ] Add unit tests
- [ ] Deploy to production

---

## 🚀 Deployment Tips

### Frontend Deployment (Vercel/Netlify)

1. Build: `npm run build:prod`
2. Deploy `dist/` folder to Vercel or Netlify

### Backend Deployment (Heroku/Railway)

1. Set environment variables
2. Deploy backend folder to Heroku
3. Update frontend API endpoint

---

## 📞 Quick Reference

### Useful Commands

```bash
# Frontend
npm start              # Run dev server
npm run build:prod    # Production build
npm run watch         # Watch for changes

# Backend
cd backend
npm start             # Start server
npm run dev          # Start with nodemon

# Both
npm run start:all    # Start both simultaneously

# Database
mongo                # Connect to MongoDB (if installed)
```

### URLs

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/health

### Default Ports

- Angular: 4200
- Express: 3000
- MongoDB: 27017

---

## ✨ Congratulations!

You should now have a fully functional professional Angular + Express application running! 🎉

**What you've set up:**

- ✅ Angular 15 with traditional NgModules
- ✅ Express.js REST API
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ Product catalog with cart
- ✅ Order management
- ✅ Admin panel (template)

**What's next?**

- Start modifying components to add features
- Study the service layer for business logic
- Learn how the interceptors work
- Explore the backend models and routes

Happy coding! 🚀
