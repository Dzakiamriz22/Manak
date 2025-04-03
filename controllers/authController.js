const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === "admin" ? "admin" : "user";

  db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, userRole],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Registrasi gagal!", error: err });
      res.status(201).json({ message: "Registrasi berhasil!", userId: result.insertId });
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Email tidak ditemukan!" });

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ message: "Password salah!" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login berhasil!", token, role: user.role });
  });
};


// GET USER PROFILE
exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query("SELECT id, username, email, role FROM users WHERE id = ?", [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    res.json(results[0]);
  });
};
