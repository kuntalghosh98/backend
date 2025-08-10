// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser , updateProfile} = require('../controllers/userController');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');
const getBaseUrl = require('../utils/getBaseUrl');
const url = getBaseUrl();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Fallback URL if FRONTEND_URL is not set

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.redirect(`${frontendUrl}/loginregister?token=${token}`);
  }
);
router.patch('/profile/update-profile', protect, updateProfile);
router.get('/profile', protect, getUser);

module.exports = router;
