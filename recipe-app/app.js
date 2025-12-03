// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser'); // or use express.urlencoded
const passport = require('./config/passport'); // <- we just created this

const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');

const app = express();

// Mongo connect db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static 
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(bodyParser.urlencoded({ extended: false }));

// Sessions 
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

//  user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);

app.get('/', async (req, res) => {
  try {
    const Recipe = require('./models/Recipe');
    const latestRecipes = await Recipe.find().sort({ createdAt: -1 }).limit(6).exec();
    res.render('home', { latestRecipes });
  } catch (err) {
    console.error(err);
    res.render('home', { latestRecipes: [] });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

