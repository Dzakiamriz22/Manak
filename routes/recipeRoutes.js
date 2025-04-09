const express = require("express");
const {
  addRecipe,
  editRecipe,
  softDeleteRecipe,
  hardDeleteRecipe,
  getAllRecipes,
  getRecipeById,
  getSoftDeletedRecipes,
  restoreRecipe
} = require("../controllers/recipeController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/recipes", authenticateToken, isAdmin, addRecipe);
router.put("/recipes/:id", authenticateToken, isAdmin, editRecipe);
router.patch("/recipes/:id/soft-delete", authenticateToken, isAdmin, softDeleteRecipe);
router.delete("/recipes/:id", authenticateToken, isAdmin, hardDeleteRecipe);
router.get("/recipes/trash", authenticateToken, isAdmin, getSoftDeletedRecipes);
router.patch("/recipes/:id/restore", authenticateToken, isAdmin, restoreRecipe);


router.get("/recipes", authenticateToken, getAllRecipes);
router.get("/recipes/:id", authenticateToken, getRecipeById);

module.exports = router;