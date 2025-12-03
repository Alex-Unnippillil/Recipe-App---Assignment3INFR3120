// routes/auth.js

const express = require('express');
const passport = require('passport');

const router = express.Router();

// Login page ( Google / GitHub)
router.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Sign in' });
});

// Google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login'
  }),
  (req, res) => {
    // Successful authentication, redirect home
    res.redirect('/recipes');
  }
);

// GitHub login
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login'
  }),
  (req, res) => {
    res.redirect('/recipes');
  }
);

// Logout
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/recipes');
  });
});

module.exports = router;
