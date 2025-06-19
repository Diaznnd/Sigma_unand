// routes/adminKegiatanRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdminUKM } = require("../middleware/auth");
const { Kegiatan, Organisasi } = require("../models");

// INDEX: Tampilkan daftar kegiatan
router.get("/", isAuthenticated, isAdminUKM, async (req, res) => {
  try {
    const ukmId = req.session.user.ukm_id;
    const kegiatanList = await Kegiatan.findAll({
      where: { ukm_id: ukmId },
      order: [["tanggal", "DESC"]],
    });

    const ukm = await Organisasi.findByPk(ukmId);

    res.render("adminukm/kegiatan/index", {
      user: req.session.user,
      ukm,
      kegiatanList,
    });
  } catch (error) {
    console.error("Gagal mengambil daftar kegiatan:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kegiatan.");
  }
});

// FORM TAMBAH
router.get("/tambah", isAuthenticated, isAdminUKM, async (req, res) => {
  const ukm = await Organisasi.findByPk(req.session.user.ukm_id);
  res.render("adminukm/kegiatan/tambah", {
    user: req.session.user,
    ukm,
  });
});

// PROSES TAMBAH
router.post("/tambah", isAuthenticated, isAdminUKM, async (req, res) => {
  try {
    const { nama, deskripsi, tanggal } = req.body;
    await Kegiatan.create({
      nama,
      deskripsi,
      tanggal,
      ukm_id: req.session.user.ukm_id,
    });
    res.redirect("/adminukm/kegiatan");
  } catch (error) {
    console.error("Gagal menambahkan kegiatan:", error);
    res.status(500).send("Terjadi kesalahan saat menambahkan kegiatan.");
  }
});

// FORM EDIT
router.get("/edit/:id", isAuthenticated, isAdminUKM, async (req, res) => {
  const kegiatan = await Kegiatan.findByPk(req.params.id);
  const ukm = await Organisasi.findByPk(req.session.user.ukm_id);
  if (!kegiatan) return res.status(404).send("Kegiatan tidak ditemukan");

  res.render("adminukm/kegiatan/edit", {
    user: req.session.user,
    ukm,
    kegiatan,
  });
});

// PROSES EDIT
router.post("/edit/:id", isAuthenticated, isAdminUKM, async (req, res) => {
  try {
    const { nama, deskripsi, tanggal } = req.body;
    await Kegiatan.update(
      { nama, deskripsi, tanggal },
      { where: { id: req.params.id } }
    );
    res.redirect("/adminukm/kegiatan");
  } catch (error) {
    console.error("Gagal mengedit kegiatan:", error);
    res.status(500).send("Terjadi kesalahan saat mengedit kegiatan.");
  }
});

// HAPUS
router.post("/hapus/:id", isAuthenticated, isAdminUKM, async (req, res) => {
  try {
    await Kegiatan.destroy({ where: { id: req.params.id } });
    res.redirect("/adminukm/kegiatan");
  } catch (error) {
    console.error("Gagal menghapus kegiatan:", error);
    res.status(500).send("Terjadi kesalahan saat menghapus kegiatan.");
  }
});

module.exports = router;
