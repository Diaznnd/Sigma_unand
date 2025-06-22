const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, Masalah, LaporanAktivitas, Faq, Kerjasama } = require('../models'); 
const puppeteer = require('puppeteer');
const path = require('path'); 
const ejs = require('ejs');

exports.showLogin = (req, res) => {
  res.render('auth/login');
};

exports.showRegister = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  const { first_name, last_name, email, nim, major, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.send("Email sudah terdaftar.");
    const hash = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, nim, major, password_hash: hash, role: 'user' });
    res.redirect('/auth/login');
  } catch (e) {
    res.send("Gagal register: " + e.message);
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  const superAdminEmail = 'superadmin@gmail.com';
  const superAdminPassword = 'superadmin123';

  // Logika hardcode untuk Super Admin. Ini TIDAK bergantung pada database.
  if (identifier === superAdminEmail && password === superAdminPassword) {
    req.session.user = { username: 'Super Admin', role: 'superadmin' };
    return req.session.save(err => {
      if (err) { return res.send("Gagal membuat session: " + err.message); }
      return res.redirect('/auth/profil-super-admin');
    });
  }

  // Logika untuk user biasa dari database
  try {
    const user = await User.findOne({ where: { [Op.or]: [{ email: identifier }, { nim: identifier }] } });
    if (!user) return res.send("User tidak ditemukan atau password salah");
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.send("User tidak ditemukan atau password salah");

    req.session.user = { id: user.id, first_name: user.first_name, email: user.email, role: user.role };
    return req.session.save(err => {
        if(err) { return res.send("Gagal membuat session: " + err.message); }
      // Arahkan ke dasbor yang sesuai berdasarkan role
      if (user.role === 'admin') {
        return res.redirect('/auth/manajemen-admin'); // Contoh, admin diarahkan ke manajemen
      }
        return res.redirect('/auth/dashboard'); // User biasa ke dasbor biasa
    });
  } catch (e) {
    res.send("Gagal login: " + e.message);
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) { return res.send("Gagal logout."); }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
};

exports.showSuperAdminProfile = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('profil-super-admin', { layout: 'layouts/app-layout', admin: req.session.user });
  } else {
    res.redirect('/auth/login');
  }
};

// ... dan semua fungsi controller lainnya yang sudah kita buat ...
exports.showLaporanAktivitas = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    try {
      const semuaLaporan = await LaporanAktivitas.findAll({ order: [['createdAt', 'DESC']] });
      res.render('laporan-aktivitas', { layout: 'layouts/app-layout', user: req.session.user, laporanList: semuaLaporan });
    } catch (error) {
      console.error("Gagal mengambil daftar laporan:", error);
      res.status(500).send("Gagal memuat halaman laporan.");
    }
  } else {
    res.redirect('/auth/login');
  }
};

exports.kirimLaporanAktivitas = async (req, res) => {
  try {
    const { judul, tanggal, detail } = req.body;
    if (!judul || !tanggal || !detail) { return res.status(400).send('Semua field harus diisi.'); }
    await LaporanAktivitas.create({ judul, tanggal, detail });
    res.redirect('/auth/laporan-aktivitas');
  } catch (error) {
    console.error('Gagal menyimpan data laporan aktivitas:', error);
    res.status(500).send('Gagal menyimpan laporan. Cek konsol server.');
  }
};

exports.cetakLaporanPdf = async (req, res) => {
  try {
    const laporanId = req.params.id;
    const laporan = await LaporanAktivitas.findOne({ where: { id: laporanId } });
    if (!laporan) { return res.status(404).send("Laporan tidak ditemukan."); }
    const templatePath = path.join(__dirname, '../views/cetak-laporan.ejs');
    const html = await ejs.renderFile(templatePath, { laporan: laporan.toJSON() });
    const browser = await puppeteer.launch({ executablePath: puppeteer.executablePath(), timeout: 0, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="laporan-${laporan.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    res.status(500).send("Gagal membuat PDF. Cek konsol server.");
  }
};

exports.showStatistikKegiatan = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('statistik-kegiatan', { layout: 'layouts/app-layout', user: req.session.user });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showKerjaSama = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    try {
      const dummyData = [
        { nama: 'Event Organizer Lokal', tanggal: new Date(), ukm: 'UKM Musik', tentang: 'Sponsorship untuk Festival Musik Kampus', detail: 'Mengajukan kerjasama sponsorship dengan nilai Rp 5.000.000 untuk acara puncak Dies Natalis.', status: 'pending'},
        { nama: 'Percetakan ABC', tanggal: new Date(), ukm: 'UKM Jurnalistik', tentang: 'Cetak Majalah Kampus Edisi Spesial', detail: 'Penawaran diskon 30% untuk pencetakan 500 eksemplar majalah kampus edisi spesial wisuda.', status: 'pending'},
      ];
      for (const item of dummyData) {
        await Kerjasama.findOrCreate({ where: { nama: item.nama, tentang: item.tentang }, defaults: item });
      }
      const kerjasamaPending = await Kerjasama.findAll({ where: { status: 'pending' }, order: [['createdAt', 'DESC']] });
      res.render('kerja-sama', { layout: 'layouts/app-layout', user: req.session.user, kerjasamaList: kerjasamaPending });
    } catch (error) {
      console.error("Gagal mengambil data kerjasama:", error);
      res.status(500).send("Gagal memuat halaman kerjasama.");
    }
  } else {
    res.redirect('/auth/login');
  }
};

exports.showDetailKerjasama = async (req, res) => {
  try {
    const kerjasama = await Kerjasama.findByPk(req.params.id);
    if (!kerjasama) { return res.status(404).send("Data kerjasama tidak ditemukan."); }
    res.render('detail-kerjasama', { layout: 'layouts/app-layout', user: req.session.user, kerjasama: kerjasama });
  } catch (error) {
    res.status(500).send("Gagal memuat halaman detail.");
  }
};

exports.updateStatusKerjasama = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    await Kerjasama.update({ status: status }, { where: { id: id } });
    res.redirect('/auth/kerja-sama');
  } catch (error) {
    console.error("Gagal update status kerjasama:", error);
    res.status(500).send("Gagal update status.");
  }
};

exports.showUkmPendaftaran = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const dummyPendaftar = [
      { id: 1, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
      { id: 2, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
      { id: 3, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' }
    ];
    res.render('ukm-pendaftaran', { layout: 'layouts/app-layout', user: req.session.user, pendaftarList: dummyPendaftar });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showMasalahUkm = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('masalah-ukm', { layout: 'layouts/app-layout', user: req.session.user });
  } else {
    res.redirect('/auth/login');
  }
};

exports.kirimMasalahUkm = async (req, res) => {
  try {
    const { nama_ukm, masalah, tanggal } = req.body;
    if (!nama_ukm || !masalah || !tanggal) { return res.status(400).send('Semua field harus diisi.'); }
    await Masalah.create({ nama_ukm, masalah, tanggal });
    res.redirect('/auth/masalah-ukm');
  } catch (error) {
    console.error('Gagal menyimpan data masalah:', error);
    res.status(500).send('Gagal menyimpan data masalah. Cek konsol server.');
  }
};

exports.showFaq = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    try {
      const answeredFaqs = await Faq.findAll({ where: { status: 'answered' }, order: [['updatedAt', 'DESC']] });
      res.render('faq', { layout: 'layouts/app-layout', user: req.session.user, faqList: answeredFaqs });
    } catch (error) {
      res.status(500).send("Gagal memuat halaman FAQ.");
    }
  } else { res.redirect('/auth/login'); }
};

exports.showKelolaFaq = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    try {
      const dummyQuestions = [
        { question: 'Bagaimana cara mendaftar UKM baru jika periode pendaftaran sudah lewat?', status: 'pending' },
        { question: 'Di mana saya bisa melihat jadwal kegiatan untuk semester ini?', status: 'pending' }
      ];
      for (const q of dummyQuestions) {
        await Faq.findOrCreate({ where: { question: q.question }, defaults: q });
      }
      const pendingFaqs = await Faq.findAll({ where: { status: 'pending' } });
      res.render('kelola-faq', { layout: 'layouts/app-layout', user: req.session.user, faqList: pendingFaqs });
    } catch (error) {
      res.status(500).send("Gagal memuat halaman kelola FAQ.");
    }
  } else { res.redirect('/auth/login'); }
};

exports.showJawabFaqForm = async (req, res) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) { return res.status(404).send("Pertanyaan tidak ditemukan."); }
    res.render('jawab-faq', { layout: 'layouts/app-layout', user: req.session.user, faq: faq });
  } catch (error) {
    res.status(500).send("Gagal memuat halaman.");
  }
};

exports.simpanJawabanFaq = async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;
    if (!answer) { return res.status(400).send("Jawaban tidak boleh kosong."); }
    await Faq.update({ answer: answer, status: 'answered' }, { where: { id: id } });
    res.redirect('/auth/kelola-faq');
  } catch (error) {
    res.status(500).send("Gagal menyimpan jawaban.");
  }
};

// --- FUNGSI-FUNGSI MANAJEMEN ADMIN ---

exports.showManajemenAdmin = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    try {
      const dummyAdminsData = [
        { first_name: 'Admin', last_name: 'Satu', email: 'admin1@example.com', password: 'password123', role: 'admin' },
        { first_name: 'Admin', last_name: 'Dua', email: 'admin2@example.com', password: 'password123', role: 'admin' }
      ];
      for (const adminData of dummyAdminsData) {
        const hash = await bcrypt.hash(adminData.password, 10);
        await User.findOrCreate({
          where: { email: adminData.email },
          defaults: {
            first_name: adminData.first_name,
            last_name: adminData.last_name,
            email: adminData.email,
            password_hash: hash,
            role: adminData.role
          }
        });
      }
      const adminList = await User.findAll({ where: { role: 'admin' }, order: [['createdAt', 'ASC']] });
      res.render('manajemen-admin', { layout: 'layouts/app-layout', user: req.session.user, adminList: adminList });
    } catch (error) {
      console.error("Gagal mengambil daftar admin:", error);
      res.status(500).send("Gagal memuat halaman manajemen admin.");
    }
  } else {
    res.redirect('/auth/login');
  }
};

exports.showTambahAdminForm = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('tambah-admin', {
      layout: 'layouts/app-layout',
      user: req.session.user
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.tambahAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).send("Email sudah digunakan.");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      first_name,
      last_name,
      email,
      password_hash: hash,
      role: 'admin'
    });
    res.redirect('/auth/manajemen-admin');
  } catch (error) {
    console.error("Gagal menambah admin:", error);
    res.status(500).send("Gagal menambah admin baru.");
  }
};

exports.showEditAdminForm = async (req, res) => {
  try {
    const admin = await User.findByPk(req.params.id);
    if (!admin || admin.role !== 'admin') { return res.status(404).send("Admin tidak ditemukan."); }
    res.render('edit-admin', {
      layout: 'layouts/app-layout',
      user: req.session.user,
      admin: admin
    });
  } catch (error) {
    console.error("Gagal memuat halaman edit admin:", error);
    res.status(500).send("Gagal memuat halaman edit.");
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminId = req.params.id;
    let updateData = { email: email };
    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
      updateData.password_hash = hash;
    }
    await User.update(updateData, { where: { id: adminId } });
    res.redirect('/auth/manajemen-admin');
  } catch (error) {
    console.error("Gagal update admin:", error);
    res.status(500).send("Gagal update admin.");
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    await User.destroy({ where: { id: adminId, role: 'admin' } });
    res.redirect('/auth/manajemen-admin');
  } catch (error) {
    console.error("Gagal menghapus admin:", error);
    res.status(500).send("Gagal menghapus admin.");
  }
};
