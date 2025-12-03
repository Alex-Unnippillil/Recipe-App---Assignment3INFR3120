// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Show login page
router.get('/login', (req, res) => {
  res.render('login'); 
});

// Local login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user || !user.passwordHash) {
      // invalid email/ no password set
      return res.render('login', { error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.login(user, err => {
      if (err) {
        console.error(err);
        return res.render('login', { error: 'Something went wrong. Try again.' });
      }
      return res.redirect('/recipes');
    });
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
});

// Local signup 
router.get('/signup', (req, res) => {
  res.render('signup'); 
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    let existing = await User.findOne({ email }).exec();
    if (existing && existing.passwordHash) {
      return res.render('signup', { error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user =
      existing ||
      new User({
        email,
        displayName: email.split('@')[0],
      });

    user.passwordHash = passwordHash;
    await user.save();

    req.login(user, err => {
      if (err) {
        console.error(err);
        return res.render('signup', { error: 'Something went wrong. Try again.' });
      }
      return res.redirect('/recipes');
    });
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Something went wrong. Try again.' });
  }
});

// GOOGLE OAUTH
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
  }),
  (req, res) => {
    res.redirect('/recipes');
  }
);

// GITHUB OAUTH
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login',
  }),
  (req, res) => {
    res.redirect('/recipes');
  }
);

// LOGOUT
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
