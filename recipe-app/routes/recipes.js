// routes/recipes.js
// routes for the Recipe CRUD app.

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { ensureAuth } = require('../middleware/auth');

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
    console.error('Error fetching latest recipes:', err);
    res.status(500).send('Server Error');
  }
});

// GET /recipes/list - list all recipes (public)
router.get('/list', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.render('recipes', {
      pageTitle: 'All Recipes',
      recipes
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Server Error');
  }
});

// GET /recipes/new - show new recipe form (AUTH ONLY)
router.get('/new', ensureAuth, (req, res) => {
  res.render('new', { pageTitle: 'Add Recipe' });
});

// POST /recipes - create new recipe (AUTH ONLY)
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { title, ingredients, cookingTime } = req.body;

    await Recipe.create({
      title,
      ingredients,
      cookingTime
    });

    res.redirect('/recipes/list');
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).send('Server Error: Could not create recipe');
  }
});

// GET /recipes/:id - show single recipe (public)
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
    console.error('Error fetching recipe:', err);
    res.status(500).send('Server Error: Could not fetch recipe');
  }
});

// GET /recipes/:id/edit - edit form (AUTH ONLY)
router.get('/:id/edit', ensureAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    res.render('edit', {
      pageTitle: 'Edit Recipe',
      recipe
    });
  } catch (err) {
    console.error('Error fetching recipe for edit:', err);
    res.status(500).send('Server Error: Could not fetch recipe for edit');
  }
});

// POST /recipes/:id/update - update recipe (AUTH ONLY)
router.post('/:id/update', ensureAuth, async (req, res) => {
  try {
    const { title, ingredients, cookingTime } = req.body;

    await Recipe.findByIdAndUpdate(req.params.id, {
      title,
      ingredients,
      cookingTime
    });

    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).send('Server Error: Could not update recipe');
  }
});

// POST /recipes/:id/delete - Delete recipe (AUTH ONLY)
router.post('/:id/delete', ensureAuth, async (req, res) => {
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

