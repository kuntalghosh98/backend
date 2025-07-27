// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const getBaseUrl = require('../utils/getBaseUrl');
const url = process.env.BASE_URL;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${url}/api/users/auth/google/callback`,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      // Try to find user by googleId or email
      let user = await User.findOne({
        $or: [{ googleId: profile.id }, { email }],
      });

      if (user) {
        // If user exists but googleId is not set (came from OTP flow)
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
      } else {
        // Create new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email,
        });
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

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
