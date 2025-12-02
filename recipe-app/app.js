// app.js

// load the modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load environment variables
dotenv.config();

// Import the Recipe routes module
const recipeRoutes = require('./routes/recipes');

// create an express application
const app = express();

// Configure view engine as EJStemplating
app.set('view engine', 'ejs');

// Middleware parse incoming form data
app.use(express.urlencoded({ extended: true }));


// Serve static files from the public directory / css  , images, js
app.use(express.static('public'));

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("Error: MONGODB_URI not set ");
    process.exit(1);  // Exit if no connection 
}

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB database"))
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });

// Root route - redirect to recipes home page
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.use('/recipes', recipeRoutes);

// Redirect root URL to recipes home page
app.get('/', (req, res) => {
    res.redirect('/recipes');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server started - port:${PORT}. http://localhost:${PORT}/`);
});