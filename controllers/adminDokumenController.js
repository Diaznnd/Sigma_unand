const { DokumenKegiatan, Kegiatan, Organisasi } = require('../models');
const path = require('path');

exports.index = async (req, res) => {
  try {
    const dokumenList = await DokumenKegiatan.findAll({
      where: { ukm_id: req.session.user.ukm_id },
      include: [
        { model: Kegiatan, as: 'kegiatan' }  // <-- Penting untuk akses `doc.kegiatan.nama`
      ],
      order: [['createdAt', 'DESC']]
    });

    const ukm = await Organisasi.findByPk(req.session.user.ukm_id);

    res.render('adminukm/dokumen/index', {
      user: req.session.user,
      ukm,
      dokumenList
    });
  } catch (error) {
    console.error("Gagal menampilkan dokumen:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data dokumen.");
  }
};

exports.tambahForm = async (req, res) => {
  const kegiatan = await Kegiatan.findAll({ where: { ukm_id: req.session.user.ukm_id } });
  res.render('adminukm/dokumen/tambah', { kegiatan, user: req.session.user });
};

exports.simpan = async (req, res) => {
  try {
    const { judul, deskripsi, kegiatan_id } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    await DokumenKegiatan.create({
      judul,
      deskripsi,
      file,
      kegiatan_id,
      ukm_id: req.session.user.ukm_id
    });

    res.redirect('/adminukm/dokumen');
  } catch (error) {
    console.error('Gagal menyimpan dokumen:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan.');
  }
};

exports.hapus = async (req, res) => {
  try {
    await DokumenKegiatan.destroy({ where: { id: req.params.id } });
    res.redirect('/adminukm/dokumen');
  } catch (error) {
    console.error('Gagal menghapus dokumen:', error);
    res.status(500).send('Terjadi kesalahan saat menghapus.');
  }
};


