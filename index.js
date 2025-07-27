require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const passport = require('./config/passport'); // Optional
const connectDB = require('./config/db');      // 🔄 Moved DB connect logic

// Route imports
const userRoutes = require('./routes/userRoutes');
const userOtpRoutes = require('./routes/userOtpRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishListRoutes = require('./routes/wishListRoutes');
const addressRoutes = require('./routes/addressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const newArrivalsRoutes = require('./routes/newArrivalsRoutes');
const highlightedProductRoutes = require('./routes/highlightedProductRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const productScrollListRoutes = require('./routes/productScrollListRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const razorpayWebhook = require('./routes/webhookRoutes');


const app = express();
const port = process.env.PORT || 4000;

// 🛢️ Connect to DB
connectDB();

// 🌐 CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://yourdomain.com',
  'https://admin.yourdomain.com',
  'https://www.auriusluxury.com',
  'https://frontend-eta-one-16.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 📦 Body parser
app.use(express.json());

// 🧠 Session setup (only if needed for Google login)
if (process.env.ENABLE_SESSIONS === 'true') {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());
} else {
  console.warn('⚠️ Passport session not initialized. Set ENABLE_SESSIONS=true in .env for Google Login to work.');
}


// 🖼️ Serve static files (temporary — to be replaced by Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚀 API Routes
app.use('/api/webhook', razorpayWebhook);
app.use('/api/users', userRoutes);
app.use('/api/users/otp', userOtpRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishListRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/newarrivals', newArrivalsRoutes);
app.use('/api/highlighted-products', highlightedProductRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/product-scroll-list', productScrollListRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ❤️ Health check route
app.get('/', (req, res) => {
  res.send('Server is up and running.');
});

// 🧯 Global Error Handler (optional to add later)

// 🚀 Start Server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
