// routes/recipes.js
// routes for the Recipe CRUD app.

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET /recipes/ - Home page - show latest 3 recipes
router.get('/', async (req, res) => {
  try {
    const latestRecipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.render('home', {
      pageTitle: 'Home',
      latestRecipes
    });
  } catch (err) {
    console.error('Error loading home page:', err);
    res.status(500).send('Server Error: Home page');
  }
});

// GET /recipes/list - Public page - lists all recipes
router.get('/list', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ title: 1 });

    res.render('recipes', {
      pageTitle: 'All Recipes',
      recipes
    });
  } catch (err) {
    console.error('Error fetching recipe list:', err);
    res.status(500).send('Server Error: Recipe list');
  }
});

// GET /recipes/new - Form to create new recipe
router.get('/new', (req, res) => {
  res.render('new', { pageTitle: 'Add Recipe' });
});

// POST /recipes/ - Create new recipe in MongoDB
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, cookingTime } = req.body;

    await Recipe.create({
      title,
      ingredients,
      cookingTime
    });

    console.log('New recipe created:', title);
    res.redirect('/recipes/list');
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).send('Server Error: Could not create recipe');
  }
});

// GET /recipes/:id - Show single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    res.render('recipe', {
      pageTitle: recipe.title,
      recipe
    });
  } catch (err) {
    console.error('Error fetching recipe details:', err);
    res.status(500).send('Server Error: Could not retrieve recipe');
  }
});

// GET /recipes/:id/edit - Show edit form recipe
router.get('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    res.render('edit', {
      pageTitle: `Edit ${recipe.title}`,
      recipe
    });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Server Error: Could not load edit form');
  }
});

// POST /recipes/:id/update - Handle update submission
router.post('/:id/update', async (req, res) => {
  try {
    const { title, ingredients, cookingTime } = req.body;

    await Recipe.findByIdAndUpdate(req.params.id, {
      title,
      ingredients,
      cookingTime
    });

    console.log('Recipe updated:', req.params.id);
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).send('Server Error: Could not update recipe');
  }
});

// POST /recipes/:id/delete - Delete a recipe with confirmation on client 
router.post('/:id/delete', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    console.log('Recipe deleted:', req.params.id);
    res.redirect('/recipes/list');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).send('Server Error: Could not delete recipe');
  }
});

module.exports = router;
