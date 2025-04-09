const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    const newUser = await User.create({ username, email, password: hashedPassword, role: userRole });

    res.status(201).json({ message: "Registrasi berhasil!", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Registrasi gagal!", error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Email tidak ditemukan!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Password salah!" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login berhasil!", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan!", error: error.message });
  }
};

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role"],
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan!", error: error.message });
  }
};