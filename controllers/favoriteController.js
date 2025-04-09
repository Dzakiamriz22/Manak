const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");

// Tambah ke favorit
exports.addFavorite = async (req, res) => {
  try {
    const { recipe_id } = req.body;
    const user_id = req.user.id;

    // Cek apakah resep ada
    const recipe = await Recipe.findByPk(recipe_id);
    if (!recipe) {
      return res.status(404).json({ message: "Resep tidak ditemukan!" });
    }

    // Cek apakah sudah difavoritkan
    const existingFavorite = await Favorite.findOne({ where: { user_id, recipe_id } });
    if (existingFavorite) {
      return res.status(400).json({ message: "Resep sudah ada di favorit!" });
    }

    // Tambahkan ke favorit
    await Favorite.create({ user_id, recipe_id });
    res.status(201).json({ message: "Resep berhasil ditambahkan ke favorit!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan ke favorit!", error });
  }
};

// Melihat daftar favorit pengguna
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        { model: Recipe, as: "recipe", attributes: ["id", "title", "category_id"] }
      ],
    });

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil daftar favorit!", error });
  }
};

// Hapus dari favorit
exports.removeFavorite = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const user_id = req.user.id;

    const deleted = await Favorite.destroy({ where: { user_id, recipe_id } });

    if (!deleted) {
      return res.status(404).json({ message: "Resep tidak ditemukan di favorit!" });
    }

    res.json({ message: "Resep berhasil dihapus dari favorit!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus dari favorit!", error });
  }
};