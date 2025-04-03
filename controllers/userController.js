const db = require("../config/db");

exports.getAllUsers = (req, res) => {
  db.query("SELECT id, username, email, role, created_at FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data pengguna!", error: err });
    
    res.json(results);
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus pengguna!", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan!" });
    }

    res.json({ message: "Pengguna berhasil dihapus!" });
  });
};
