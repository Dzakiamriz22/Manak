const db = require("../config/db");

// GET ALL CATEGORIES (Public)
exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil kategori!", error: err });

    res.json(results);
  });
};

// CREATE CATEGORY (Admin only)
exports.createCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi!" });

  db.query("INSERT INTO categories (name, created_at, updated_at) VALUES (?, NOW(), NOW())", 
  [name], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menambah kategori!", error: err });

    res.status(201).json({ message: "Kategori berhasil ditambahkan!", id: result.insertId });
  });
};

// UPDATE CATEGORY (Admin only)
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi!" });

  db.query("UPDATE categories SET name = ?, updated_at = NOW() WHERE id = ?", 
  [name, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengupdate kategori!", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan!" });
    }

    res.json({ message: "Kategori berhasil diperbarui!" });
  });
};

// DELETE CATEGORY (Admin only)
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus kategori!", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan!" });
    }

    res.json({ message: "Kategori berhasil dihapus!" });
  });
};