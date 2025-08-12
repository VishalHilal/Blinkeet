# 🛒 Blinkeet - E-commerce Grocery Delivery Platform

A modern e-commerce grocery delivery web application inspired by Blinkit, built with the MERN stack. Blinkeet offers a seamless shopping experience with smart product search, cart management, and admin dashboard for complete store management.

![Blinkeet Logo](client/public/Blinkeet.png)

## 🌟 Features

### 🛍️ Shopping Experience
- **Guest & User Cart System**: Cart persists after login, seamless transition between guest and authenticated users
- **Smart Product Search**: Real-time search with suggestions and filters
- **Category Navigation**: Browse products by categories and subcategories
- **Product Management**: Add to cart, remove items, and update quantities
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🔐 Authentication & Security
- **JWT Authentication**: Secure signup, login, and logout functionality
- **User Profiles**: Manage personal information and addresses
- **Password Recovery**: Forgot password with email verification
- **OTP Verification**: Secure two-factor authentication

### 🛒 Cart & Checkout
- **Persistent Cart**: Cart items preserved across sessions
- **Order Summary**: Detailed order review before checkout
- **Multiple Payment Options**: Stripe integration for secure payments
- **Order Tracking**: Real-time order status updates

### 👨‍💼 Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Category Management**: Organize products with categories and subcategories
- **Order Management**: View and manage customer orders
- **User Management**: Monitor user activities and profiles
- **Analytics**: Sales and inventory insights

### 📱 Mobile Responsive
- **Mobile-First Design**: Optimized for all device sizes
- **Touch-Friendly Interface**: Intuitive mobile navigation
- **Progressive Web App**: Fast loading and offline capabilities

## 🚀 Live Demo

https://blinkit-drab.vercel.app

## 📸 Screenshots

### Homepage
![Homepage](https://i.postimg.cc/hPs57Znk/homePage.png)

### Product Search
![Product Search](https://i.postimg.cc/JnRTnjgr/Search-Page.png)

### Shopping Cart
![Shopping Cart](https://i.postimg.cc/nLjRgHmx/My-CArt.png)

### Admin Dashboard
![Admin Dashboard](https://i.postimg.cc/jqPVChLT/admin-Panel.png)

### Checkout Page
![Checkout Page](https://i.postimg.cc/7ZxjsGwT/checkout-Page.png)

### Upload Product 
![Upload Product](https://i.postimg.cc/PJJ0X0Vz/upload-Products.png)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **Stripe React** - Payment integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **Resend** - Email service
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Nodemon** - Development server

## 📁 Project Structure


blinkit/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── provider/      # Context providers
│   │   └── route/         # Routing configuration
│   ├── package.json
│   └── vite.config.js
├── config/                # Database and service configurations
├── controllers/           # Route controllers
├── middleware/            # Custom middleware
├── models/               # MongoDB schemas
├── route/                # API routes
├── utils/                # Utility functions
├── views/                # EJS templates
├── index.js              # Server entry point
└── package.json


## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**

   git clone https://github.com/vishal-hilal/Blinkeet.git
   cd Blinkeet


2. **Install dependencies**

   npm install


3. **Environment Configuration**
   Create a `.env` file in the root directory:

   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RESEND_API_KEY=your_resend_api_key
   FRONTEND_URL=your_frontend_url


4. **Start the server**
   npm run dev

### Frontend Setup

1. **Navigate to client directory**
   cd client


2. **Install dependencies**
   npm install


3. **Start development server**
   npm run dev


4. **Build for production**
   npm run build


## 🔧 Environment Variables

### Backend (.env)

# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/blinkeet

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Frontend URL
FRONTEND_URL=your_frontend_url


## 📡 API Routes

### Authentication

POST   /api/user/register     # User registration
POST   /api/user/login        # User login
POST   /api/user/logout       # User logout
GET    /api/user/profile      # Get user profile
PUT    /api/user/profile      # Update user profile
POST   /api/user/forgot-password  # Forgot password
POST   /api/user/reset-password   # Reset password


### Products

GET    /api/product           # Get all products
GET    /api/product/:id       # Get product by ID
POST   /api/product           # Create product (Admin)
PUT    /api/product/:id       # Update product (Admin)
DELETE /api/product/:id       # Delete product (Admin)


### Categories

GET    /api/category          # Get all categories
POST   /api/category          # Create category (Admin)
PUT    /api/category/:id      # Update category (Admin)
DELETE /api/category/:id      # Delete category (Admin)


### Cart

GET    /api/cart              # Get user cart
POST   /api/cart              # Add item to cart
PUT    /api/cart/:id          # Update cart item
DELETE /api/cart/:id          # Remove cart item


### Orders

GET    /api/order             # Get user orders
POST   /api/order             # Create order
GET    /api/order/:id         # Get order details


### Address

GET    /api/address           # Get user addresses
POST   /api/address           # Add new address
PUT    /api/address/:id       # Update address
DELETE /api/address/:id       # Delete address


## 🧪 Testing

# Run backend tests
npm test

# Run frontend tests
cd client
npm test


## 📦 Deployment

### Backend Deployment (Vercel/Render)
1. Connect your GitHub repository to Vercel or Render
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Frontend Deployment (Vercel)
1. Navigate to client directory
2. Deploy using Vercel CLI or connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License

Copyright (c) 2025 Vishal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell    
copies of the Software, and to permit persons to whom the Software is         
furnished to do so, subject to the following conditions:                      

The above copyright notice and this permission notice shall be included in   
all copies or substantial portions of the Software.                           

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR   
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,     
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER       
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING      
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.

## 🙏 Acknowledgments

- [Blinkit](https://blinkit.com) for inspiration
- [Tailwind CSS](https://tailwindcss.com) for the amazing CSS framework
- [Vite](https://vitejs.dev) for the fast build tool
- [Stripe](https://stripe.com) for payment processing
- [Cloudinary](https://cloudinary.com) for image storage


⭐ **Star this repository if you found it helpful!** 