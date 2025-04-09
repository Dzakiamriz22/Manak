const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const Favorite = require("./Favorite");

const Recipe = sequelize.define("Recipe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  steps: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
  underscored: true,
});

Recipe.belongsTo(User, { foreignKey: "user_id", as: "creator" });
Recipe.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Recipe.hasMany(Favorite, { foreignKey: "recipe_id", as: "favorites" });

module.exports = Recipe;
