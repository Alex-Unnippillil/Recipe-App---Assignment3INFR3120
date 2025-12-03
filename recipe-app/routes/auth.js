// routes/auth.js

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


// Login page Google / GitHub / Email+Password
router.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Sign in', error: null });
});

// Email + password login
router.post('/login/email', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).render('login', {
        pageTitle: 'Sign in',
        error: 'Please enter both email and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).render('login', {
        pageTitle: 'Sign in',
        error: 'Password should be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ provider: 'local', email: normalizedEmail });

    if (!user) {
      // New local user create account
      const passwordHash = await bcrypt.hash(password, 10);

      user = await User.create({
        provider: 'local',
        providerId: normalizedEmail,
        displayName: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        passwordHash
      });

      console.log('Created new local user:', normalizedEmail);
    } else {
      // Existing local user- check password
      const passwordMatches = await bcrypt.compare(password, user.passwordHash || '');

      if (!passwordMatches) {
        return res.status(400).render('login', {
          pageTitle: 'Sign in',
          error: 'Incorrect email or password.'
        });
      }
    }

    // Log the user in via Passport
    req.login(user, err => {
      if (err) return next(err);
      return res.redirect('/recipes');
    });
  } catch (err) {
    console.error('Error with email login:', err);
    next(err);
  }
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
