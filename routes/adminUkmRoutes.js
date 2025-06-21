const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAuthenticated, isAdminUKM } = require("../middleware/auth");
const { User, Organisasi, Anggota, Kegiatan, Berita } = require("../models");

const upload = multer({ dest: "public/uploads/" });

function sanitizeURL(url) {
  if (!url) return null;
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : "https://" + url;
}

/* === DASHBOARD ADMIN UKM === */
router.get("/", isAuthenticated, isAdminUKM, async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  const now = Date.now();
  const skipUntil = req.session.skipProfileReminderUntil || 0;
  const showReminder = !ukmId && now > skipUntil;
  const ukm = ukmId ? await Organisasi.findByPk(ukmId) : null;

  let totalAnggota = 0;
  let totalKegiatan = 0;

  if (ukmId) {
    totalKegiatan = await Kegiatan.count({ where: { ukm_id: ukmId } });
    totalBerita = await Berita.count({ where: { ukm_id: ukmId } });
  }

  res.render("adminukm/dashboard", {
    user: req.session.user,
    ukm,
    showReminder,
    stats: { totalAnggota, totalKegiatan, totalBerita },
  });
});

/* === TUNDA PENGISIAN PROFIL (15 menit) === */
router.post("/tunda-profil", isAuthenticated, isAdminUKM, (req, res) => {
  req.session.skipProfileReminderUntil = Date.now() + 15 * 60 * 1000;
  res.redirect("/adminukm");
});

/* === FORM ISI PROFIL PERTAMA KALI === */
router.get("/profil", isAuthenticated, isAdminUKM, async (req, res) => {
  if (req.session.user.ukm_id) {
    return res.redirect("/adminukm/profil/detail");
  }

  res.render("adminukm/profil", {
    user: req.session.user,
    ukm: null,
  });
});

router.post("/profil", isAuthenticated, isAdminUKM, upload.single("logo"), async (req, res) => {
  const { namaOrg, deskripsi, tanggalBerdiri, visi, misi, alamat, kontak, jenis } = req.body;
  const instagram = sanitizeURL(req.body.instagram);
  const website = sanitizeURL(req.body.website);
  const logo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newOrg = await Organisasi.create({
      namaOrg,
      deskripsi,
      tanggalPengajuan: new Date(),
      tanggalBerdiri,
      logo,
      instagram,
      website,
      visi,
      misi,
      alamat,
      kontak,
      jenis,
      userId: req.session.user.id
    });

    await User.update({ ukm_id: newOrg.id }, { where: { id: req.session.user.id } });
    req.session.user.ukm_id = newOrg.id;

    res.redirect("/adminukm/profil/detail");
  } catch (error) {
    console.error("Gagal menyimpan profil UKM:", error);
    res.status(500).send("Terjadi kesalahan saat menyimpan profil.");
  }
});

/* === HALAMAN DETAIL PROFIL === */
router.get("/profil/detail", isAuthenticated, isAdminUKM, async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  if (!ukmId) return res.redirect("/adminukm/profil");

  try {
    const ukm = await Organisasi.findByPk(ukmId);
    if (!ukm) return res.redirect("/adminukm/profil");

    const totalKegiatan = await Kegiatan.count({ where: { ukm_id: ukmId } });

    res.render("adminukm/detailProfil", {
      user: req.session.user,
      ukm,
      stats: {
        totalKegiatan
      }
    });
  } catch (error) {
    console.error("Gagal menampilkan detail profil:", error);
    res.status(500).send("Gagal menampilkan detail profil UKM.");
  }
});

/* === EDIT PROFIL === */
router.get("/profil/edit", isAuthenticated, isAdminUKM, async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  if (!ukmId) return res.redirect("/adminukm/profil");

  try {
    const ukm = await Organisasi.findByPk(ukmId);
    if (!ukm) return res.status(404).send("Profil tidak ditemukan");

    res.render("adminukm/editProfil", {
      user: req.session.user,
      ukm,
    });
  } catch (error) {
    console.error("Gagal menampilkan form edit profil:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data profil.");
  }
});

router.post("/profil/edit", isAuthenticated, isAdminUKM, upload.single("logo"), async (req, res) => {
  const { namaOrg, deskripsi, tanggalBerdiri, visi, misi, alamat, kontak, jenis } = req.body;
  const instagram = sanitizeURL(req.body.instagram);
  const website = sanitizeURL(req.body.website);
  const logo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const ukmId = req.session.user.ukm_id;
    const ukm = await Organisasi.findByPk(ukmId);
    if (!ukm) return res.status(404).send("Profil tidak ditemukan");

    await ukm.update({
      namaOrg,
      deskripsi,
      tanggalBerdiri,
      visi,
      misi,
      alamat,
      kontak,
      instagram,
      website,
      jenis,
      logo: logo || ukm.logo
    });

    res.redirect("/adminukm/profil/detail");
  } catch (error) {
    console.error("Gagal update profil UKM:", error);
    res.status(500).send("Terjadi kesalahan saat update profil.");
  }
});

module.exports = router;
