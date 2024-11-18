//backend\config\passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/users/auth/google/callback'
},
async (token, tokenSecret, profile, done) => {
  // Find or create user in database
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;





// const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/api/users/auth/google/callback"
// },
// async (accessToken, refreshToken, profile, done) => {
//   const existingUser = await User.findOne({ googleId: profile.id });
//   if (existingUser) {
//     const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     return done(null, { user: existingUser, token });
//   }
//   const newUser = new User({
//     googleId: profile.id,
//     name: profile.displayName,
//     email: profile.emails[0].value
//   });
//   await newUser.save();
//   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   done(null, { user: newUser, token });
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.user._id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });
