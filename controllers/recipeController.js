const Recipe = require("../models/Recipe");
const User = require("../models/User");
const Category = require("../models/Category");
const Favorite = require("../models/Favorite");
const { Op } = require("sequelize");

exports.addRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, category_id, image_url } = req.body;
    const userId = req.user.id;

    const newRecipe = await Recipe.create({
      user_id: userId,
      title,
      description,
      ingredients,
      steps,
      category_id,
      image_url,
    });

    res.status(201).json({ message: "Resep berhasil ditambahkan!", recipeId: newRecipe.id });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan resep!", error });
  }
};

exports.editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, steps, category_id, image_url } = req.body;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan!" });

    await recipe.update({ title, description, ingredients, steps, category_id, image_url });

    res.json({ message: "Resep berhasil diperbarui!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengedit resep!", error });
  }
};

exports.softDeleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan!" });

    await recipe.destroy();
    res.json({ message: "Resep berhasil dihapus (soft delete)!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus resep!", error });
  }
};

exports.hardDeleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Recipe.destroy({ where: { id }, force: true });

    if (deletedRows === 0) return res.status(404).json({ message: "Resep tidak ditemukan!" });

    res.json({ message: "Resep berhasil dihapus secara permanen!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus resep!", error });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { category_id, search, sort } = req.query;
    
    const whereClause = {};

    if (category_id) {
      whereClause.category_id = category_id;
    }

    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    let order = [["title", "ASC"]];
    if (sort === "desc") {
      order = [["title", "DESC"]];
    }

    const recipes = await Recipe.findAll({
      where: whereClause,
      include: [
        { model: User, as: "creator", attributes: ["username"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
      order: order,
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil daftar resep!", error });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["username"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ message: "Resep tidak ditemukan!" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil resep!", error });
  }
};

exports.getSoftDeletedRecipes = async (req, res) => {
  try {
    console.log("Fetching soft-deleted recipes...");
    
    const recipes = await Recipe.findAll({
      where: {
        deleted_at: {
          [Op.ne]: null,
        },
      },
      include: [
        { model: User, as: "creator", attributes: ["username"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
      paranoid: false,
    });    

    if (recipes.length === 0) {
      console.log("No soft-deleted recipes found.");
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching soft-deleted recipes:", error);
    res.status(500).json({ message: "Gagal mengambil daftar resep yang dihapus!", error });
  }
};

exports.restoreRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredRows = await Recipe.restore({ where: { id } });

    if (restoredRows === 0) return res.status(404).json({ message: "Resep tidak ditemukan atau sudah aktif!" });

    res.json({ message: "Resep berhasil dipulihkan!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memulihkan resep!", error });
  }
};