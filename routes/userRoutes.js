//backend\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser,getUser } = require('../controllers/userController');
const passport = require('../config/passport'); 
const jwt = require('jsonwebtoken'); 
const { protect } = require('../middleware/authMiddleware');
router.post('/register', registerUser);
router.post('/login', loginUser);


// Google authentication routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
     // Generate a JWT token
     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    
    // Successful authentication, redirect home or send a JWT token
    res.redirect(`http://localhost:3000/LoginRegister?token=${token}`); // or handle JWT token response
  }
);
// Get user details
router.get('/profile', protect, getUser);
// router.get('/auth/check', (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.status(200).json({ message: 'Authenticated' });
//   } else {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }
// });

module.exports = router;
