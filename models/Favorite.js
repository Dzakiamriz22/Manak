const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Recipe = require("./Recipe");

const Favorite = sequelize.define(
  "Favorite",
  {
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
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Recipe,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    uniqueKeys: {
      unique_favorite: {
        fields: ["user_id", "recipe_id"],
      },
    },
  }
);

Favorite.belongsTo(User, { foreignKey: "user_id", as: "user" });
Favorite.belongsTo(Recipe, { foreignKey: "recipe_id", as: "recipe" });

module.exports = Favorite;