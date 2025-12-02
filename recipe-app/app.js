// app.js

// load the modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');


// load environment variables
dotenv.config();

// Import the Recipe routes module
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipes');

// create an express application
const app = express();

// Connect to MongoDB
connectDB();


// Configure view engine as EJStemplating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware parse incoming form data
app.use(express.urlencoded({ extended: true }));


// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, 'public')));


// use routes /recipes
app.use('/recipes', recipeRoutes);

// Root route: redirect all traffic
app.get('/', (req, res) => {
  res.redirect('/recipes');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server start: http://localhost:${PORT}`);
});