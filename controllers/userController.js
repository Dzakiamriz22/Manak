const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pengguna!", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan!" });
    }

    res.json({ message: "Pengguna berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pengguna!", error });
  }
};