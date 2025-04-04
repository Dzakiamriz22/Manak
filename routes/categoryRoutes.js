const express = require("express");
const { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require("../controllers/categoryController");

const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/categories", getAllCategories);
router.post("/categories", authenticateToken, isAdmin, createCategory);
router.put("/categories/:id", authenticateToken, isAdmin, updateCategory);
router.delete("/categories/:id", authenticateToken, isAdmin, deleteCategory);

module.exports = router;