const express = require("express");
const {
  addRecipe,
  editRecipe,
  softDeleteRecipe,
  hardDeleteRecipe,
  getAllRecipes,
  getRecipeDetail,
  addToFavorites,
  getFavorites,
  removeFromFavorites,
  searchRecipes,
  getRecipesByCategory,
  getLatestRecipes,
  getPopularRecipes,
  getTrashedRecipes,
  restoreRecipe
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
router.get("/favorites", authenticateToken, getFavorites); // Get user's favorite recipes
router.post("/favorites", authenticateToken, addToFavorites); // Add recipe to favorites
router.delete("/favorites/:recipe_id", authenticateToken, removeFromFavorites); // Remove specific recipe from favorites

// Search and Filter
router.get("/recipes/search", searchRecipes); // Public - Search by title/category
router.get("/recipes/category/:category_id", getRecipesByCategory); // Public - Filter by category

// Sorting by Latest & Popular
router.get("/recipes/latest", getLatestRecipes); // Public - Latest Recipes
router.get("/recipes/popular", getPopularRecipes); // Public - Popular Recipes

// Admin-only endpoint to get trashed recipes (soft deleted)
router.get("/recipes/trash", authenticateToken, isAdmin, getTrashedRecipes);

// Admin-only endpoint to restore a soft-deleted recipe
router.patch("/recipes/:id/restore", authenticateToken, isAdmin, restoreRecipe);

module.exports = router;