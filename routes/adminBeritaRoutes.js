const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isAuthenticated, isAdminUKM } = require('../middleware/auth');
const { Berita, Organisasi } = require('../models');

// Konfigurasi upload untuk gambar
const upload = multer({ dest: 'public/uploads/' });

/* === Halaman Daftar Berita === */
router.get('/', isAuthenticated, isAdminUKM, async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  const beritaList = await Berita.findAll({ where: { ukm_id: ukmId }, order: [['tanggal', 'DESC']] });

  res.render('adminukm/berita/index', {
    user: req.session.user,
    beritaList
  });
});

/* === Form Tambah Berita === */
router.get('/tambah', isAuthenticated, isAdminUKM, (req, res) => {
  res.render('adminukm/berita/tambah', { user: req.session.user });
});

/* === Proses Tambah Berita === */
router.post('/tambah', isAuthenticated, isAdminUKM, upload.single('gambar'), async (req, res) => {
  try {
    const ukmId = req.session.user.ukm_id;

    // Ambil info UKM terlebih dahulu
    const organisasi = await Organisasi.findByPk(ukmId);
    if (!organisasi) return res.status(404).send("Organisasi tidak ditemukan");

    const penulis = organisasi.namaOrg;

    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    const { judul, isi, tanggal } = req.body;

    await Berita.create({
      judul,
      isi,
      gambar,
      tanggal,
      ukm_id: ukmId,
      penulis // otomatis diisi nama UKM
    });

    res.redirect('/adminukm/berita');
  } catch (error) {
    console.error("Gagal menyimpan berita:", error);
    res.status(500).send("Terjadi kesalahan saat menyimpan berita.");
  }
});

/* === Form Edit Berita === */
router.get('/edit/:id', isAuthenticated, isAdminUKM, async (req, res) => {
  const berita = await Berita.findByPk(req.params.id);
  if (!berita || berita.ukm_id !== req.session.user.ukm_id) {
    return res.status(403).send('Tidak diizinkan.');
  }

  res.render('adminukm/berita/edit', {
    user: req.session.user,
    berita
  });
});

/* === Proses Edit Berita === */
router.post('/edit/:id', isAuthenticated, isAdminUKM, upload.single('gambar'), async (req, res) => {
  const { judul, isi, tanggal } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const berita = await Berita.findByPk(req.params.id);
    if (!berita || berita.ukm_id !== req.session.user.ukm_id) {
      return res.status(403).send('Tidak diizinkan.');
    }

    await berita.update({
      judul,
      isi,
      tanggal,
      gambar: gambar || berita.gambar
    });

    res.redirect('/adminukm/berita');
  } catch (err) {
    console.error('Gagal mengedit berita:', err);
    res.status(500).send('Terjadi kesalahan saat mengedit berita.');
  }
});

/* === Hapus Berita === */
router.post('/hapus/:id', isAuthenticated, isAdminUKM, async (req, res) => {
  try {
    const berita = await Berita.findByPk(req.params.id);
    if (!berita || berita.ukm_id !== req.session.user.ukm_id) {
      return res.status(403).send('Tidak diizinkan.');
    }

    await berita.destroy();
    res.redirect('/adminukm/berita');
  } catch (err) {
    console.error('Gagal menghapus berita:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus berita.');
  }
});

module.exports = router;
