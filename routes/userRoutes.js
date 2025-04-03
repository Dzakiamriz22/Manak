const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", authenticateToken, isAdmin, getAllUsers);
router.delete("/users/:id", authenticateToken, isAdmin, deleteUser);

module.exports = router;