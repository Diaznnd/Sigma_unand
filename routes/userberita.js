const express = require('express');
const router = express.Router();
const { Berita } = require('../models'); // pastikan model sudah di-index

router.get('/berita', async (req, res) => {
  try {
    const daftarBerita = await Berita.findAll({ order: [['createdAt', 'DESC']] });

    res.render('user/berita', {
      title: 'Berita UKM',
      user: req.session.user || null,
      daftarBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memuat berita');
  }
});

module.exports = router;
