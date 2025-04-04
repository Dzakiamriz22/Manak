const db = require("../config/db");

// ADD RECIPE (Admin only)
exports.addRecipe = (req, res) => {
  const { title, description, ingredients, steps, category_id, image_url } = req.body;
  const userId = req.user.id; // Admin user id

  db.query(
    "INSERT INTO recipes (user_id, title, description, ingredients, steps, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [userId, title, description, ingredients, steps, category_id, image_url],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menambahkan resep!", error: err });
      res.status(201).json({ message: "Resep berhasil ditambahkan!", recipeId: result.insertId });
    }
  );
};

// EDIT RECIPE (Admin only)
exports.editRecipe = (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, steps, category_id, image_url } = req.body;

  db.query(
    "UPDATE recipes SET title = ?, description = ?, ingredients = ?, steps = ?, category_id = ?, image_url = ?, updated_at = NOW() WHERE id = ?",
    [title, description, ingredients, steps, category_id, image_url, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal mengedit resep!", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Resep tidak ditemukan!" });
      res.json({ message: "Resep berhasil diperbarui!" });
    }
  );
};

// SOFT DELETE RECIPE (Admin only)
exports.softDeleteRecipe = (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE recipes SET deleted_at = NOW() WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menghapus resep!", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Resep tidak ditemukan!" });
      res.json({ message: "Resep berhasil dihapus (soft delete)!" });
    }
  );
};

// HARD DELETE RECIPE (Admin only)
exports.hardDeleteRecipe = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM recipes WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menghapus resep!", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Resep tidak ditemukan!" });
      res.json({ message: "Resep berhasil dihapus secara permanen!" });
    }
  );
};

// GET ALL RECIPES (Admin and User)
exports.getAllRecipes = (req, res) => {
  const query = `
    SELECT recipes.id, recipes.title, recipes.description, categories.name as category, users.username as creator
    FROM recipes
    JOIN categories ON recipes.category_id = categories.id
    JOIN users ON recipes.user_id = users.id
    WHERE recipes.deleted_at IS NULL`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil daftar resep!", error: err });
    res.json(results);
  });
};

// GET RECIPE DETAIL (Admin and User)
exports.getRecipeDetail = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT recipes.*, categories.name as category, users.username as creator FROM recipes JOIN categories ON recipes.category_id = categories.id JOIN users ON recipes.user_id = users.id WHERE recipes.id = ? AND recipes.deleted_at IS NULL",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil detail resep!", error: err });
      if (results.length === 0) return res.status(404).json({ message: "Resep tidak ditemukan!" });
      res.json(results[0]);
    }
  );
};

// ADD TO FAVORITES
exports.addToFavorites = (req, res) => {
  const { recipe_id } = req.body;
  const user_id = req.user.id;

  db.query(
    "INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)",
    [user_id, recipe_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menambahkan resep ke favorit!", error: err });
      res.json({ message: "Resep berhasil ditambahkan ke favorit!" });
    }
  );
};

// REMOVE FROM FAVORITES
exports.removeFromFavorites = (req, res) => {
  const { recipe_id } = req.body;
  const user_id = req.user.id;

  db.query(
    "DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?",
    [user_id, recipe_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menghapus resep dari favorit!", error: err });
      res.json({ message: "Resep berhasil dihapus dari favorit!" });
    }
  );
};

// SEARCH RECIPES BY TITLE OR CATEGORY
exports.searchRecipes = (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ message: "Query pencarian diperlukan!" });

  const searchQuery = `
    SELECT recipes.*, categories.name AS category_name, users.username AS author 
    FROM recipes
    JOIN categories ON recipes.category_id = categories.id
    JOIN users ON recipes.user_id = users.id
    WHERE (recipes.title LIKE ? OR categories.name LIKE ?) 
    AND recipes.deleted_at IS NULL
  `;

  const searchValue = `%${q}%`;

  db.query(searchQuery, [searchValue, searchValue], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mencari resep!", error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Resep tidak ditemukan!" });
    }

    res.json(results);
  });
};

// FILTER RECIPES BY CATEGORY
exports.getRecipesByCategory = (req, res) => {
  const { category_id } = req.params;

  db.query(
    `SELECT recipes.*, categories.name AS category_name, users.username AS author 
     FROM recipes 
     JOIN categories ON recipes.category_id = categories.id
     JOIN users ON recipes.user_id = users.id
     WHERE recipes.category_id = ?`, 
    [category_id], 
    (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil resep!", error: err });

      res.json(results);
    }
  );
};