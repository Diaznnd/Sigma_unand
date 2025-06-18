const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const User = require("../models").User;
const Mahasiswa = require("../models").Mahasiswa;


// TAMBAHKAN INI
exports.showLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

exports.showRegister = (req, res) => {
  res.render('auth/register')
};

exports.register = async (req, res) => {
  const { first_name, last_name, email, nim, major, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email, nim } });
    if (existing) return res.send("Email atau NIM sudah terdaftar.");

    const hash = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, nim, major, password_hash: hash });
    res.redirect('/auth/login');
  } catch (e) {
    res.send("Gagal register: " + e.message);
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { nim: identifier }],
      },
    });

    if (!user) {
      return res.render("auth/login", { error: "Akun tidak ditemukan" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.render("auth/login", { error: "Password salah" });
    }

    let mahasiswa = null;
    if (user.role === "pengguna") {
      mahasiswa = await Mahasiswa.findOne({ where: { nim: user.nim } });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      nim: user.nim,
      role: user.role,
      mahasiswa: mahasiswa,
      ukm_id: user.ukm_id
    };

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.render("auth/login", { error: "Terjadi kesalahan saat login" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};