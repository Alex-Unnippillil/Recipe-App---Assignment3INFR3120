// config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// user is stored in the session - passport.serializeUser and deserializeUser
passport.serializeUser((user, done) => {
  done(null, user.id); // Mongo _id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          provider: 'google',
          providerId: profile.id
        });

        if (!user) {
          user = await User.create({
            provider: 'google',
            providerId: profile.id,
            displayName: profile.displayName,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : undefined,
            avatar:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : undefined
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback',
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          provider: 'github',
          providerId: profile.id
        });

        if (!user) {
          const email =
            profile.emails && profile.emails.length
              ? profile.emails[0].value
              : undefined;

          user = await User.create({
            provider: 'github',
            providerId: profile.id,
            displayName: profile.displayName || profile.username,
            email,
            avatar:
              profile.photos && profile.photos.length
                ? profile.photos[0].value
                : undefined
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
