// controllers/adminPengurusController.js
const { Pengurus, Organisasi } = require('../models');
const path = require('path');
const fs = require('fs');

exports.index = async (req, res) => {
  try {
    const ukmId = req.session.user.ukm_id;
    const pengurusList = await Pengurus.findAll({
      where: { ukm_id: ukmId },
      order: [['periode', 'DESC'], ['jabatan', 'ASC']]
    });
    const ukm = await Organisasi.findByPk(ukmId);
    res.render('adminukm/pengurus/index', { user: req.session.user, ukm, pengurusList });
  } catch (error) {
    console.error("Gagal mengambil data pengurus:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data pengurus.");
  }
};

exports.formTambah = (req, res) => {
  res.render('adminukm/pengurus/tambah', { user: req.session.user });
};

exports.simpan = async (req, res) => {
  try {
    const { nama, jabatan, periode } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    await Pengurus.create({
      nama,
      jabatan,
      periode,
      foto,
      ukm_id: req.session.user.ukm_id
    });

    res.redirect('/adminukm/pengurus');
  } catch (error) {
    console.error("Gagal menambahkan pengurus:", error);
    res.status(500).send("Terjadi kesalahan saat menyimpan pengurus.");
  }
};

exports.formEdit = async (req, res) => {
  try {
    const pengurus = await Pengurus.findByPk(req.params.id);
    if (!pengurus) return res.status(404).send("Pengurus tidak ditemukan.");
    res.render('adminukm/pengurus/edit', { user: req.session.user, pengurus });
  } catch (error) {
    console.error("Gagal menampilkan form edit pengurus:", error);
    res.status(500).send("Terjadi kesalahan.");
  }
};

exports.update = async (req, res) => {
  try {
    const { nama, jabatan, periode } = req.body;
    const pengurus = await Pengurus.findByPk(req.params.id);
    if (!pengurus) return res.status(404).send("Pengurus tidak ditemukan.");

    const fotoBaru = req.file ? `/uploads/${req.file.filename}` : pengurus.foto;
    if (req.file && pengurus.foto) {
      const pathLama = path.join(__dirname, '../public', pengurus.foto);
      if (fs.existsSync(pathLama)) fs.unlinkSync(pathLama);
    }

    await pengurus.update({ nama, jabatan, periode, foto: fotoBaru });
    res.redirect('/adminukm/pengurus');
  } catch (error) {
    console.error("Gagal memperbarui pengurus:", error);
    res.status(500).send("Terjadi kesalahan.");
  }
};

exports.hapus = async (req, res) => {
  try {
    const pengurus = await Pengurus.findByPk(req.params.id);
    if (!pengurus) return res.status(404).send("Pengurus tidak ditemukan.");

    if (pengurus.foto) {
      const pathFoto = path.join(__dirname, '../public', pengurus.foto);
      if (fs.existsSync(pathFoto)) fs.unlinkSync(pathFoto);
    }

    await pengurus.destroy();
    res.redirect('/adminukm/pengurus');
  } catch (error) {
    console.error("Gagal menghapus pengurus:", error);
    res.status(500).send("Terjadi kesalahan.");
  }
};
