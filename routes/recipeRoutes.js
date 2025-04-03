const express = require("express");
const {
  addRecipe,
  editRecipe,
  softDeleteRecipe,
  hardDeleteRecipe,
  getAllRecipes,
  getRecipeDetail,
  addToFavorites,
  removeFromFavorites,
} = require("../controllers/recipeController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only routes
router.post("/recipes", authenticateToken, isAdmin, addRecipe); // Add new recipe
router.put("/recipes/:id", authenticateToken, isAdmin, editRecipe); // Edit recipe
router.patch("/recipes/:id/soft-delete", authenticateToken, isAdmin, softDeleteRecipe); // Soft delete recipe
router.delete("/recipes/:id", authenticateToken, isAdmin, hardDeleteRecipe); // Hard delete recipe

// User and Admin routes
router.get("/recipes", authenticateToken, getAllRecipes); // Get all recipes
router.get("/recipes/:id", authenticateToken, getRecipeDetail); // Get recipe detail

// User routes for favorites
router.post("/favorites", authenticateToken, addToFavorites); // Add recipe to favorites
router.delete("/favorites", authenticateToken, removeFromFavorites); // Remove recipe from favorites

module.exports = router;