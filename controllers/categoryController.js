const Category = require("../models/Category");

// GET ALL CATEGORIES (Public)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil kategori!", error });
  }
};

// CREATE CATEGORY (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi!" });

    const newCategory = await Category.create({ name });
    res.status(201).json({ message: "Kategori berhasil ditambahkan!", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah kategori!", error });
  }
};

// UPDATE CATEGORY (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi!" });

    const [updated] = await Category.update({ name }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "Kategori tidak ditemukan!" });
    }

    res.json({ message: "Kategori berhasil diperbarui!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate kategori!", error });
  }
};

// DELETE CATEGORY (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Kategori tidak ditemukan!" });
    }

    res.json({ message: "Kategori berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus kategori!", error });
  }
};