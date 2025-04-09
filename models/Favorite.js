const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Favorite = sequelize.define("Favorite", {
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
  },
}, {
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  uniqueKeys: {
    unique_favorite: {
      fields: ["user_id", "recipe_id"],
    },
  },
});


module.exports = Favorite;
