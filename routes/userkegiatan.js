const express = require('express');
const router = express.Router();
const { Kegiatan, Organisasi } = require('../models');

router.get('/kegiatan', async (req, res) => {
  try {
  const daftarKegiatan = await Kegiatan.findAll({
  include: [{ model: Organisasi, as: 'organisasi' }], // ini wajib
  order: [['tanggal', 'DESC']],
});



    res.render('user/kegiatan', { daftarKegiatan });
 // penting: pastikan ini render 'kegiatan.ejs'
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memuat kegiatan.');
  }
});

module.exports = router;
