const sequelize = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Recipe = require("./Recipe");
const Favorite = require("./Favorite");

// Definisikan hubungan di sini
Recipe.belongsTo(User, { foreignKey: "user_id", as: "creator" });
Recipe.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Recipe.hasMany(Favorite, { foreignKey: "recipe_id", as: "favorites" });

Favorite.belongsTo(User, { foreignKey: "user_id", as: "user" });
Favorite.belongsTo(Recipe, { foreignKey: "recipe_id", as: "recipe" });

const db = {
  sequelize,
  User,
  Category,
  Recipe,
  Favorite,
};

module.exports = db;