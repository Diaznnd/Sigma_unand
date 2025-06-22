// routes/ukmRouter.js
const express = require('express');
const router = express.Router();

module.exports = (pool, pdfMake, db) => {
  router.get('/ukm', async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT 
      organisasis.*, 
      pendaftaraninfos.aktif AS pendaftaran_aktif 
    FROM organisasis
    LEFT JOIN pendaftaraninfos 
      ON organisasis.id = pendaftaraninfos.ukm_id
    WHERE organisasis.status = "Aktif"
  `);

  res.render('user/ukm', { ukm: rows, layout: false });
});


  // ✅ Detail UKM + ambil rating
  router.get('/ukm/:id', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM organisasis WHERE id = ?', [req.params.id]);

    const ukm = rows[0];
    if (!ukm) return res.status(404).send('UKM tidak ditemukan');

    let ratings = [];
    let averageRating = 0;
    let totalRatings = 0;
    
    try {
      ratings = await db.ukm_rating.findAll({
        where: { ukm_id: req.params.id },
        order: [['created_at', 'DESC']]
      });
      
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        averageRating = (sum / ratings.length).toFixed(1);
        totalRatings = ratings.length;
      }
    } catch (err) {
      console.error("Gagal mengambil rating:", err);
    }

    res.render('user/ukm-detail', { 
      ukm, 
      ratings, 
      averageRating, 
      totalRatings, 
      layout: false,
      messages: req.flash()
    });
  });

  router.get('/ukm/:id/daftar', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM organisasis WHERE id = ?', [req.params.id]);
    const ukm = rows[0];
    if (!ukm) return res.status(404).send('UKM tidak ditemukan');

    if (ukm.kegiatan && typeof ukm.kegiatan === 'string') {
      ukm.kegiatan = ukm.kegiatan.split(',').map(k => k.trim());
    } else if (!Array.isArray(ukm.kegiatan)) {
      ukm.kegiatan = [];
    }

    res.render('user/pendaftaran-ukm', { ukm, layout: false });
  });

  router.post('/ukm/:id/daftar', async (req, res) => {
    const {
      nama_lengkap, nim, email, no_telepon,
      fakultas, jurusan, angkatan, semester,
      motivasi, pengalaman, keahlian
    } = req.body;

    const [ukmRows] = await pool.execute('SELECT * FROM organisasis WHERE id = ?', [req.params.id]);

    const ukm = ukmRows[0];
    if (!ukm) return res.status(404).send('UKM tidak ditemukan');

   await pool.execute(`
  INSERT INTO pendaftaran_ukm 
  (ukm_id, ukm_nama, nama_lengkap, nim, email, no_telepon, fakultas, jurusan, 
   angkatan, semester, motivasi, pengalaman, keahlian) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [ukm.id, ukm.namaOrg, nama_lengkap, nim, email, no_telepon, fakultas, jurusan, angkatan, semester, motivasi, pengalaman, keahlian]
);

const docDefinition = {
  content: [
    { text: 'Bukti Pendaftaran UKM', style: 'header' },
    { text: `Nama: ${nama_lengkap}` },
    { text: `NIM: ${nim}` },
    { text: `UKM: ${ukm.namaOrg}` },
    { text: `Motivasi: ${motivasi}` }
  ],
  styles: {
    header: { fontSize: 18, bold: true }
  }
};


    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Bukti-Pendaftaran-${nim}.pdf"`);
      res.send(buffer);
    });
  });

  // ✅ Tambah rating UKM
  router.post('/ukm/rating/:ukmId', async (req, res) => {
    const { nama_user, rating, ulasan } = req.body;
    const { ukmId } = req.params;
    
    try {
      // Validasi input
      if (!nama_user || !rating) {
        req.flash('error', 'Nama dan rating harus diisi!');
        return res.redirect(`/ukm/${ukmId}`);
      }
      
      if (rating < 1 || rating > 5) {
        req.flash('error', 'Rating harus antara 1-5!');
        return res.redirect(`/ukm/${ukmId}`);
      }
      
      await db.ukm_rating.create({ 
        ukm_id: ukmId, 
        nama_user, 
        rating: parseInt(rating), 
        ulasan: ulasan || '' 
      });
      
      req.flash('success', 'Rating berhasil ditambahkan!');
      res.redirect(`/user/ukm/${ukmId}`);

    } catch (err) {
      console.error(err);
      req.flash('error', 'Gagal memberi rating. Silakan coba lagi.');
      res.redirect(`/user/ukm/${ukmId}`);

    }
  });

  // ✅ Update rating
  router.post('/ukm/rating/:id/edit', async (req, res) => {
  const { rating, ulasan } = req.body;
  const ratingId = req.params.id;

  try {
    const ratingData = await db.ukm_rating.findByPk(ratingId);
    if (!ratingData) {
      req.flash('error', 'Rating tidak ditemukan!');
      return res.redirect('/ukm');
    }

    await ratingData.update({
      rating: parseInt(rating),
      ulasan: ulasan || ''
    });

    req.flash('success', 'Rating berhasil diperbarui!');
        res.redirect(`/user/ukm/${ratingData.ukm_id}`);


  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal memperbarui rating.');
    res.redirect('/ukm');
  }
});

  // ✅ Hapus rating
  router.post('/ukm/rating/:id/delete', async (req, res) => {
    const ratingId = req.params.id;
    try {
      const rating = await db.ukm_rating.findByPk(ratingId);
      if (!rating) {
        req.flash('error', 'Rating tidak ditemukan!');
        return res.redirect('/ukm');
      }
      
      const ukmId = rating.ukm_id;
      await rating.destroy();
      req.flash('success', 'Rating berhasil dihapus!');
      res.redirect(`/user/ukm/${ukmId}`);

    } catch (err) {
      console.error(err);
      req.flash('error', 'Gagal menghapus rating.');
      res.redirect('/ukm');
    }
  });

  return router;
};