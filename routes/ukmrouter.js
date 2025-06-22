// routes/ukmRouter.js
const express = require('express');
const router = express.Router();

module.exports = (pool, pdfMake) => {
  router.get('/ukm', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM ukm_master WHERE status = "Aktif"');
    res.render('user/ukm', { ukm: rows, layout: false });
  });

  router.get('/ukm/:id', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM ukm_master WHERE id = ?', [req.params.id]);
    const ukm = rows[0];
    if (!ukm) return res.status(404).send('UKM tidak ditemukan');
    res.render('user/ukm-detail', { ukm, layout: false });
  });

  router.get('/ukm/:id/daftar', async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM ukm_master WHERE id = ?', [req.params.id]);
    const ukm = rows[0];
    if (!ukm) return res.status(404).send('UKM tidak ditemukan');

    // Konversi kegiatan menjadi array jika berupa string
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

    const [ukmRows] = await pool.execute('SELECT * FROM ukm_master WHERE id = ?', [req.params.id]);
    const ukm = ukmRows[0];
    if (!ukm) return res.status(404).send('UKM tidak ditemukan');

    await pool.execute(`
      INSERT INTO pendaftaran_ukm 
      (ukm_id, ukm_nama, nama_lengkap, nim, email, no_telepon, fakultas, jurusan, 
       angkatan, semester, motivasi, pengalaman, keahlian) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ukm.id, ukm.nama, nama_lengkap, nim, email, no_telepon, fakultas, jurusan, angkatan, semester, motivasi, pengalaman, keahlian]);

    const docDefinition = {
      content: [
        { text: 'Bukti Pendaftaran UKM', style: 'header' },
        { text: `Nama: ${nama_lengkap}` },
        { text: `NIM: ${nim}` },
        { text: `UKM: ${ukm.nama}` },
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

  return router;
};
