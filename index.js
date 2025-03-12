// require('dotenv').config();
// const session = require('express-session'); 
// const port = process.env.PORT || 4000;
// const express=require("express");
// const app=express();
// const mongoose= require("mongoose");
// const jwt=require("jsonwebtoken");
// const multer=require("multer");
// const path=require("path");
// const cors=require("cors"); 
// const passport = require('./config/passport');
// const paymentRoutes = require('./routes/paymentRoutes');

// // In your main app file, e.g., app.js
// const newArrivalsRoutes = require('./routes/newArrivalsRoutes');
// // In your main app file, e.g., app.js
// const highlightedProductRoutes = require('./routes/highlightedProductRoutes');
// // In your main app file, e.g., app.js
// const bannerRoutes = require('./routes/bannerRoutes');







// app.use(express.json());
// app.use(cors());
// app.use(passport.initialize());


// // Session middleware
// // app.use(session({
// //     secret: process.env.SESSION_SECRET || 'your_session_secret',
// //     resave: false,
// //     saveUninitialized: true
// //   }));
  

// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_session_secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//       sameSite: 'none', // Ensures cross-site requests are allowed
//       secure: process.env.NODE_ENV === 'production' // Set to true in production
//     }
//   }));
//   // Initialize Passport and session
//   app.use(passport.initialize());
//   app.use(passport.session());

// //Database Connection
// // mongoose.connect("mongodb+srv://Kuntal:Bong$7585@cluster0.0hdhyvo.mongodb.net/website");
// // mongoose.connect(process.env.MONGODB_URI)
// // .then(() => {
// //   console.log('MongoDB connected');
// // })
// // .catch((err) => {
// //   console.error('MongoDB connection error:', err);
// // });

// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.log(err));
// //--------------------------------------------------------
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// //Routes
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/users', require('./routes/userOtpRoutes'));
// app.use('/api/location', require('./routes/locationRoutes'));
// app.use('/api/cart', require('./routes/cartRoutes'));
// app.use('/api/address',require('./routes/addressRoutes'))
// app.use('/api/payment', paymentRoutes);
// app.use('/api/newarrivals', newArrivalsRoutes);
// app.use('/api/highlighted-products', highlightedProductRoutes);
// app.use('/api/banners', bannerRoutes);

// //Root Api
// app.get("/",(req,res)=>{
//     res.send("express is running")
// })
// app.listen(port,(error)=>{
//     if(!error){ 
//         console.log("Server running properly")
//     }else{
//         console.log(error)
//     }
// })

// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your frontend URL
//     credentials: true
//   }));








require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const passport = require('./config/passport');
const path = require("path");
const paymentRoutes = require('./routes/paymentRoutes');
const newArrivalsRoutes = require('./routes/newArrivalsRoutes');
const highlightedProductRoutes = require('./routes/highlightedProductRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const productScrollListRoutes = require('./routes/productScrollListRoutes');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001'], // Replace with your frontend URL
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production' // Set to true in production
  }
}));

app.use(passport.initialize());
app.use(passport.session());

console.log(process.env.MONGODB_URI);

const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
  console.error('MongoDB connection string is missing. Please check your .env file.');
  process.exit(1); // Exit the application
}

mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/users/otp', require('./routes/userOtpRoutes')); // Separate route for OTP
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishListRoutes'));
app.use('/api/address', require('./routes/addressRoutes'));
app.use('/api/payment', paymentRoutes);
app.use('/api/newarrivals', newArrivalsRoutes);
app.use('/api/highlighted-products', highlightedProductRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/product-scroll-list', productScrollListRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Express is running");
});

// Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running properly");
  } else {
    console.error(error);
  }
});
