const express = require('express');
const router = express.Router();
const { Berita } = require('../models');

// Route untuk menampilkan detail berita berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const berita = await Berita.findByPk(req.params.id);

    if (!berita) {
      return res.status(404).send('Berita tidak ditemukan');
    }

    res.render('user/detailberita', { berita });
  } catch (error) {
    console.error('Gagal mengambil detail berita:', error);
    res.status(500).send('Terjadi kesalahan server');
  }
});

module.exports = router;
