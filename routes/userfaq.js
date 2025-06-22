// routes/userfaq.js
const express = require('express');
const router = express.Router();
const { qna } = require('../models'); // pastikan pakai 'qna' bukan 'Question'
const { Usulan } = require('../models');
const { Penilaian } = require('../models');
const { Kolaborasi } = require('../models');
const { Organisasi } = require('../models');
const { Pendaftaran } = require('../models');

router.get('/faq/faq', (req, res) => {
  res.render('user/faq/faq', { user: req.session.user });
});

router.get('/dashboard', (req, res) => {
  res.render('user/dashboard', { user: req.session.user });
});


//qna

router.get('/faq/qna', async (req, res) => {
  try {
    const questions = await qna.findAll({ order: [['createdAt', 'DESC']] });
     console.log('📋 Isi pertanyaan dari DB:', questions);
    res.render('user/faq/qna', { user: req.session.user, questions });
  } catch (error) {
    console.error('Error fetching qna:', error);
    res.status(500).send('Error loading qna bro');
  }
});


//


router.post('/faq/qna/add', async (req, res) => {
  try {
    const { userName, userEmail, activityCategory, questionTitle, questionContent, priority } = req.body;
    // Simpan pertanyaan ke database
    await qna.create({
      userName,
      userEmail,
      activityCategory,
      questionTitle,
      questionContent,
      priority
    });
    // Redirect kembali ke halaman QnA setelah menambahkan pertanyaan
    res.redirect('/user/faq/qna');
  } catch (error) {
    console.error('Gagal menambahkan pertanyaan:', error);
    res.status(500).send('Gagal menambahkan pertanyaan');
  }
});



//usulan


// router.get('/faq/usulan', async (req, res) => {
//   try {
//     const usulan = await Usulan.findAll({ order: [['createdAt', 'DESC']] });
//     console.log(usulan); // Log pertanyaan yang diambil
//     res.render('user/faq/usulan', { user: req.session.user, usulan });
//   } catch (error) {
//     console.error('Error fetching usulan:', error); // Log kesalahan
//     res.status(500).send('Error loading usulan bro');
//   }
// });


router.get('/faq/usulan', async (req, res) => {
  try {
    const usulan = await Usulan.findAll({
      order: [['createdAt', 'DESC']]
    });

    const organisasi = await Organisasi.findAll({
      order: [['namaOrg', 'ASC']]
    });

    res.render('user/faq/usulan', {
      user: req.session.user,
      usulan,
      organisasi // kirim ke view
    });
  } catch (error) {
    console.error('❌ Error loading usulan:', error);
    res.status(500).send('Error loading usulan bro');
  }
});




router.post('/faq/usulan/add', async (req, res) => {
  try {

    console.log('📥 Data yang dikirim form:', req.body);

    
    const {
      namaPengusul, nim, ukm_id, ukm, kategori, judulKegiatan,
      deskripsi, tanggal, waktuMulai, waktuSelesai,
      lokasi, estimasiPeserta, anggaran, catatan
    } = req.body;

    await Usulan.create({
      namaPengusul,
      nim,
      ukm_id,
      ukm,
      kategori,
      judulKegiatan,
      deskripsi,
      tanggal,
      waktuMulai,
      waktuSelesai,
      lokasi,
      estimasiPeserta,
      anggaran,
      catatan
    });

    res.redirect('/user/faq/usulan');
  } catch (error) {
    console.error('Gagal menyimpan usulan:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan usulan.');
  }
});


//nilai

// router.get('/faq/nilai', async (req, res) => {
//   try {
//     const penilaian = await Penilaian.findAll({ order: [['createdAt', 'DESC']] });
//     console.log(penilaian); // Log pertanyaan yang diambil
//     res.render('user/faq/nilai', { user: req.session.user, penilaian });
//   } catch (error) {
//     console.error('Error fetching penilaian:', error); // Log kesalahan
//     res.status(500).send('Error loading penilaian bro');
//   }
// });


router.get('/faq/nilai', async (req, res) => {
  try {
    const penilaian = await Penilaian.findAll({
      order: [['createdAt', 'DESC']]
    });

    const organisasi = await Organisasi.findAll({
      order: [['namaOrg', 'ASC']]
    });

    res.render('user/faq/nilai', {
      user: req.session.user,
      penilaian,
      organisasi // kirim ke view
    });
  } catch (error) {
    console.error('❌ Error loading nilai:', error);
    res.status(500).send('Error loading nilai bro');
  }
});

router.post('/faq/nilai/add', async (req, res) => {
  try {
    console.log('📥 Data yang dikirim form:', req.body);

    const {
      ukm_id,
      ukm,
      kegiatan,
      nama,
      nim,
      overall,
      content,
      speaker,
      organization,
      facilities,
      liked,
      suggestions,
      recommend,
      additional_comments

    } = req.body;

    await Penilaian.create({
      ukm_id,
      ukm,
      kegiatan,
      nama,
      nim,
      overall,
      content,
      speaker,
      organization,
      facilities,
      liked,
      suggestions,
      recommend,
      additional_comments
    });

    res.redirect('/user/faq/nilai');
  } catch (error) {
    console.error('Gagal menyimpan nilai:', error);
    res.status(500).send('Terjadi kesalahan saat nilai usulan.');
  }
});

//kolaborasi

router.get('/faq/kolaborasi', async (req, res) => {
  try {
    const kolaborasi = await Kolaborasi.findAll({ order: [['createdAt', 'DESC']] });
    console.log(kolaborasi); // Log pertanyaan yang diambil
    res.render('user/faq/kolaborasi', { user: req.session.user, kolaborasi });
  } catch (error) {
    console.error('Error fetching kolaborasi:', error); // Log kesalahan
    res.status(500).send('Error loading kolaborasi bro');
  }
});


router.post('/faq/kolaborasi/add', async (req, res) => {
  try {
    const {
    ukmPengaju, ukmTujuan,judul,jenis,targetPeserta,tanggalMulai,tanggalSelesai,lokasi,
    deskripsi,tujuan,kontribusi,anggaran,sumberDana,rincianAnggaran,penanggungJawab,
    jabatan,noTelepon,email
    } = req.body;

    await Kolaborasi.create({
    ukmPengaju, ukmTujuan,judul,jenis,targetPeserta,tanggalMulai,tanggalSelesai,lokasi,
    deskripsi,tujuan,kontribusi,anggaran,sumberDana,rincianAnggaran,penanggungJawab,
    jabatan,noTelepon,email
    });

    res.redirect('/user/faq/kolaborasi');
  } catch (error) {
    console.error('Gagal menyimpan kolaborasi:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan kolaborasi.');
  }
});





// Tampilkan daftar pendaftar
router.get('/pendaftaran/hasil', async (req, res) => {
  try {
    const pendaftar = await Pendaftaran.findAll({ order: [['tanggal_daftar', 'DESC']] });
    res.render('user/hasil_pendaftaran', { user: req.session.user, pendaftar });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal mengambil data pendaftaran.');
  }
});

// Unduh sebagai CSV
router.get('/pendaftaran/hasil/download', async (req, res) => {
  try {
    const pendaftar = await Pendaftaran.findAll();
    const rows = pendaftar.map(p => ({
      NIM: p.nim,
      Nama: p.nama_lengkap,
      UKM: p.ukm_nama,
      Fakultas: p.fakultas,
      Jurusan: p.jurusan,
      Angkatan: p.angkatan,
      Semester: p.semester,
      Status: p.status_pendaftaran,
      Email: p.email,
      Telepon: p.no_telepon
    }));

    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map(row => Object.values(row).join(','))
    ].join('\n');

    res.setHeader('Content-Disposition', 'attachment; filename="pendaftaran.csv"');
    res.set('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal mengunduh data.');
  }
});







const upload = require('../middleware/upload'); 

const { Galeri } = require('../models');

router.get('/faq/galeri', async (req, res) => {
  try {
    const galeri = await Galeri.findAll({ order: [['tanggal', 'DESC']] });
    res.render('user/faq/galeri', { user: req.session.user, galeri });
  } catch (err) {
    console.error("❌ Error fetching galeri:", err);
    res.status(500).send("Gagal memuat galeri.");
  }
});



router.get('/galeri/upload', (req, res) => {
  res.render('admin/galeri_upload');
});

router.post('/galeri/upload', upload.single('gambar'), async (req, res) => {
  try {
    await Galeri.create({
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      gambar: '/uploads/galeri/' + req.file.filename, // simpan path
      tanggal: new Date(),
      ukm_id: 1 // contoh
    });

    res.redirect('/user/faq/galeri');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal upload gambar');
  }
});

router.get('/faq/galeri', async (req, res) => {
  const galeri = await Galeri.findAll({ order: [['tanggal', 'DESC']] });
  res.render('user/faq/galeri', { galeri });
});


module.exports = router;
