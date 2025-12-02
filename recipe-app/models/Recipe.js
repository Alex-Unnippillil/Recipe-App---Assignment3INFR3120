// models/Recipe.js

const mongoose = require('mongoose');

// Define a Mongoose schema for Recipe
const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },        // Recipe title: required true
    ingredients: { type: String, required: true },  // Ingredients list: required true
    cookingTime: { type: Number, required: true }   // Cooking time in minutes: required true

}, {
    timestamps: true  // This will automatically add createdAt and updatedAt fields
});

// Create Recipe model from schema
const Recipe = mongoose.model('Recipe', RecipeSchema);

// Export the model
module.exports = Recipe;
