const express = require('express');
const router = express.Router();
const controller = require('../controllers/authcontroller');
const { isAuthenticated } = require('../middleware/auth');

// Rute Autentikasi Dasar
router.get('/login', controller.showLogin);
router.post('/login', controller.login);
router.get('/register', controller.showRegister);
router.post('/register', controller.register);
router.get('/logout', controller.logout);

// Rute Dasbor Utama
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('auth/dashboard', { user: req.session.user });
});

// Rute Halaman Profil Super Admin
router.get('/profil-super-admin', controller.showSuperAdminProfile);  

// Rute Halaman Laporan Aktivitas
router.get('/laporan-aktivitas', controller.showLaporanAktivitas);
router.post('/laporan-aktivitas/kirim', controller.kirimLaporanAktivitas);
router.get('/laporan-aktivitas/cetak/:id', controller.cetakLaporanPdf);

// Rute Halaman Statistik Kegiatan
router.get('/statistik-kegiatan', controller.showStatistikKegiatan);

// Rute Halaman Daftar Kerjasama
router.get('/kerja-sama', controller.showKerjaSama);
router.get('/kerja-sama/lihat/:id', controller.showDetailKerjasama);
router.post('/kerja-sama/update-status/:id', controller.updateStatusKerjasama);

// Rute Halaman Manajemen Admin
router.get('/manajemen-admin', controller.showManajemenAdmin);
router.post('/admin/delete/:id', controller.deleteAdmin);
router.get('/admin/edit/:id', controller.showEditAdminForm);
router.post('/admin/edit/:id', controller.updateAdmin);
router.get('/admin/tambah', controller.showTambahAdminForm);
router.post('/admin/tambah', controller.tambahAdmin);

// Rute Halaman Pendaftaran UKM
router.get('/ukm-pendaftaran', controller.showUkmPendaftaran);

// Rute Halaman Masalah UKM
router.get('/masalah-ukm', controller.showMasalahUkm);
router.post('/masalah-ukm/kirim', controller.kirimMasalahUkm);

// Rute-rute untuk Fitur FAQ
router.get('/faq', controller.showFaq);
router.get('/kelola-faq', controller.showKelolaFaq);
router.get('/faq/jawab/:id', controller.showJawabFaqForm);
router.post('/faq/jawab/:id', controller.simpanJawabanFaq);

router.get('/berita', (req, res) => {
  const beritaList = Array.from({ length: 12 }, (_, i) => ({
    judul: `Judul Berita ${i + 1}`,
    isi: `Lorem ipsum dolor sit amet...`
  }));
  res.render('berita', { beritaList });
});

module.exports = router;
