// models/Recipe.js

const mongoose = require('mongoose');

// Define a Mongoose schema for Recipe
const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // Recipe title
    ingredients: { type: String, required: true },  // Ingredients list
    cookingTime: { type: Number, required: true }   // Cooking time in minutes
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Create Recipe model from schema
const Recipe = mongoose.model('Recipe', RecipeSchema);

// Export the model
module.exports = Recipe;
