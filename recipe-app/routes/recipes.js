// routes/recipes.js

const express = require('express');
const router = express.Router();
// Import the Recipe model to perform database operation
const Recipe = require('../models/Recipe');

// Route: GET "/" - Home page
router.get('/', async (req, res) => {
    try {
        const latestRecipes = await Recipe.find().sort({ createdAt: -1 }).limit(3);
        // Render the home.ejs view, passing latestRecipes and a title
        res.render('home', { latestRecipes });
    } catch (err) {
        console.error("Error Loading Home page:", err);
        res.status(500).send("Server Error Home Page");
    }
});

// Route: GET "/recipes" - List all recipes 
router.get('/', async (req, res) => {
});


// Route: GET "/recipes/list" - (Alternate) List all recipes
router.get('/list', async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ title: 1 });  // find all recipes, sorted by title
        res.render('recipes', { recipes });  // render recipes.ejs view, passing the list of recipes
    } catch (err) {
        console.error("Error fetching recipes list:", err);
        res.status(500).send("Server Error on Listing Page");
    }
});

// Route: GET "/recipes/new"
router.get('/new', (req, res) => {
    res.render('new');  // render new.ejs
});

// Route: POST "/recipes" Creates a new recipe in the database
router.post('/', async (req, res) => {
    try {
        // Get data from the request body 
        const { title, ingredients, cookingTime } = req.body;
        // Create a new Recipe document in MongoDB
        await Recipe.create({ title, ingredients, cookingTime });
        console.log("New recipe created:", title);
        // Redirect to the public recipe listing page 
        res.redirect('/recipes/list');  // after creation, go to list of recipes
    } catch (err) {
        console.error("Error creating recipe:", err);
        //  send error response
        res.status(500).send("Server Error: Could Not Create the Recipe,");
    }
});

// Route: GET "/recipes/:id" - View a single recipe's details
router.get('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).send("Recipe not found");
        }
        res.render('recipe', { recipe });  // render recipe.ejs 
        console.error("Error Fetching recipe details :", err);
        res.status(500).send("Server Error: Could not Retrieve recipe");
    }
});

// Route: GET "/recipes/:id/edit" - Show edit form existing recipes
router.get('/:id/edit', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).send("Recipe to edit not found");
        }
        res.render('edit', { recipe });  // render edit.ejs, passing the existing recipe data
    } catch (err) {
        console.error("Error loading edit form:", err);
        res.status(500).send("Server Error: Could not load edit form");
    }
});

// Route: POST "/recipes/:id/update" - Update an existing recipe
router.post('/:id/update', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { title, ingredients, cookingTime } = req.body;
        await Recipe.findByIdAndUpdate(recipeId, { title, ingredients, cookingTime });
        console.log("Recipe updated:", recipeId);
        res.redirect('/recipes/' + recipeId);  // redirect to the updated recipe's detail page
    } catch (err) {
        console.error("Error updating recipe:", err);
        res.status(500).send("Server Error: Could not update recipe");
    }
});

// Route: POST "/recipes/:id/delete" - Delete a recipe
router.post('/:id/delete', async (req, res) => {
    try {
        const recipeId = req.params.id;
        await Recipe.findByIdAndDelete(recipeId);
        console.log("Recipe deleted:", recipeId);
        res.redirect('/recipes/list');  // redirect to list after deletion
    } catch (err) {
        console.error("Error deleting recipe:", err);
        res.status(500).send("Server Error: Could not delete recipe");
    }
});

module.exports = router;
