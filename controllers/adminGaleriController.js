const { Galeri, GaleriItem, Organisasi } = require('../models');
const fs = require('fs');
const path = require('path');

// Tampilkan semua galeri
exports.index = async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  try {
    const galeriList = await Galeri.findAll({
      where: { ukm_id: ukmId },
      include: [{ model: GaleriItem, as: 'items' }]
    });
    const ukm = await Organisasi.findByPk(ukmId);
    res.render('adminukm/galeri/index', { galeriList, user: req.session.user, ukm });
  } catch (error) {
    console.error('Gagal menampilkan daftar galeri:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data galeri.');
  }
};

// Tampilkan form tambah galeri
exports.showFormTambah = (req, res) => {
  res.render('adminukm/galeri/tambah', { user: req.session.user });
};

// Simpan galeri baru
exports.tambah = async (req, res) => {
  const { judul, deskripsi, jenis, referensi_id } = req.body;
  const files = req.files;
  try {
    const galeri = await Galeri.create({
      judul,
      deskripsi,
      jenis,
      referensi_id,
      ukm_id: req.session.user.ukm_id
    });

    if (files?.length > 0) {
      const items = files.map(file => ({
        galeri_id: galeri.id,
        gambar: '/uploads/' + file.filename
      }));
      await GaleriItem.bulkCreate(items);
    }

    req.flash('success_msg', 'Galeri berhasil ditambahkan.');
    res.redirect('/adminukm/galeri');
  } catch (error) {
    console.error('Gagal menambahkan galeri:', error);
    req.flash('error_msg', 'Gagal menambahkan galeri.');
    res.redirect('/adminukm/galeri');
  }
};

// Form edit galeri
exports.showFormEdit = async (req, res) => {
  const id = req.params.id;
  try {
    const galeri = await Galeri.findByPk(id, {
      include: [{ model: GaleriItem, as: 'items' }]
    });
    if (!galeri) return res.status(404).send('Galeri tidak ditemukan');

    res.render('adminukm/galeri/edit', {
      galeri,
      user: req.session.user
    });
  } catch (error) {
    console.error('Gagal menampilkan form edit:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data galeri.');
  }
};

// Update galeri + tambah gambar baru
exports.edit = async (req, res) => {
  console.log('>> MASUK KE EDIT CONTROLLER');
  const id = req.params.id;
  const { judul, deskripsi, jenis, referensi_id } = req.body;
  const files = req.files;

  try {
    const galeri = await Galeri.findByPk(id);
    if (!galeri) return res.status(404).send('Galeri tidak ditemukan');

    await galeri.update({ judul, deskripsi, jenis, referensi_id });

    if (files?.length > 0) {
      const items = files.map(file => ({
        galeri_id: galeri.id,
        gambar: '/uploads/' + file.filename
      }));
      await GaleriItem.bulkCreate(items);
    }

    req.flash('success_msg', 'Galeri berhasil diperbarui.');
    res.redirect('/adminukm/galeri'); // ✅ redirect ke halaman index (daftar galeri)
  } catch (error) {
    console.error('Gagal mengupdate galeri:', error);
    req.flash('error_msg', 'Gagal mengupdate galeri.');
    res.redirect('/adminukm/galeri/edit/' + id);
  }
};

// Hapus seluruh galeri dan itemnya
exports.hapus = async (req, res) => {
  const id = req.params.id;

  try {
    const items = await GaleriItem.findAll({ where: { galeri_id: id } });
    for (const item of items) {
      const filePath = path.join(__dirname, '../public', item.gambar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await GaleriItem.destroy({ where: { galeri_id: id } });
    await Galeri.destroy({ where: { id } });

    req.flash('success_msg', 'Galeri berhasil dihapus.');
    res.redirect('/adminukm/galeri');
  } catch (error) {
    console.error('Gagal menghapus galeri:', error);
    req.flash('error_msg', 'Gagal menghapus galeri.');
    res.redirect('/adminukm/galeri');
  }
};

// Hapus 1 gambar dari galeri
exports.hapusGambarSatuan = async (req, res) => {
  const { galeriId, itemId } = req.params;

  try {
    const item = await GaleriItem.findOne({ where: { id: itemId, galeri_id: galeriId } });
    if (!item) {
      req.flash('error_msg', 'Gambar tidak ditemukan.');
      return res.redirect(`/adminukm/galeri/edit/${galeriId}`);
    }

    const filePath = path.join(__dirname, '../public', item.gambar);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await GaleriItem.destroy({ where: { id: itemId, galeri_id: galeriId } });

    req.flash('success_msg', 'Gambar berhasil dihapus.');
    res.redirect(`/adminukm/galeri/edit/${galeriId}`);
  } catch (error) {
    console.error('Gagal menghapus gambar:', error);
    req.flash('error_msg', 'Terjadi kesalahan saat menghapus gambar.');
    res.redirect(`/adminukm/galeri/edit/${galeriId}`);
  }
};

exports.showDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const galeri = await Galeri.findByPk(id, {
      include: [{ model: GaleriItem, as: 'items' }]
    });

    if (!galeri) {
      req.flash('error_msg', 'Galeri tidak ditemukan.');
      return res.redirect('/adminukm/galeri');
    }

    res.render('adminukm/galeri/detail', {
      galeri,
      user: req.session.user
    });
  } catch (error) {
    console.error('Gagal menampilkan detail galeri:', error);
    req.flash('error_msg', 'Terjadi kesalahan.');
    res.redirect('/adminukm/galeri');
  }
};
