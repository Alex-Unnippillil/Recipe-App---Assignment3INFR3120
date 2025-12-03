// app.js\
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
dotenv.config();

// DB + routes
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');

// Passport config
require('./config/passport');

// Create express app
const app = express();

// Connect to MongoDB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: false }));

// Session middleware for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev secret',
    resave: false,
    saveUninitialized: false
    // cookie: { secure: false }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Make logged-in user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/recipes');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server start: http://localhost:${PORT}`);
});
