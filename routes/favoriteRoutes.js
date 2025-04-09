const express = require("express");
const { addFavorite, getFavorites, removeFavorite } = require("../controllers/favoriteController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/favorites", authenticateToken, addFavorite);
router.get("/favorites", authenticateToken, getFavorites);
router.delete("/favorites/:recipe_id", authenticateToken, removeFavorite);

module.exports = router;