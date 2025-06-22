const { PendaftaranInfo, FormField } = require('../models');
const path = require('path');
const fs = require('fs');

// GET form info pendaftaran
exports.formInfo = async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  const info = await PendaftaranInfo.findOne({ where: { ukm_id: ukmId } });
  const fields = await FormField.findAll({ where: { ukm_id: ukmId }, order: [['id', 'ASC']] });


  const success = req.flash('success');
  const error = req.flash('error');

  res.render('adminukm/pendaftaran/info', {
    info,
    fields,
    user: req.session.user,
    messages: {
      success: success.length ? success[0] : null,
      error: error.length ? error[0] : null
    }
  });
};

// POST simpan info pendaftaran
exports.simpanInfo = async (req, res) => {
  const { deskripsi, aktif } = req.body;
  const dokumenFiles = req.files || {};
  const ukmId = req.session.user.ukm_id;

  try {
    const file1 = dokumenFiles.file1?.[0]?.filename ? `/uploads/${dokumenFiles.file1[0].filename}` : null;
    const file2 = dokumenFiles.file2?.[0]?.filename ? `/uploads/${dokumenFiles.file2[0].filename}` : null;

    const isAktif = aktif === '1' || aktif === 'on';

    const existing = await PendaftaranInfo.findOne({ where: { ukm_id: ukmId } });

    if (existing) {
      await existing.update({
        deskripsi,
        aktif: isAktif,
        file1: file1 || existing.file1,
        file2: file2 || existing.file2
      });
    } else {
      await PendaftaranInfo.create({
        deskripsi,
        aktif: isAktif,
        file1,
        file2,
        ukm_id: ukmId
      });
    }

    res.redirect('/adminukm/pendaftaran/info');
  } catch (err) {
    console.error('Gagal simpan info pendaftaran:', err);
    res.status(500).send('Gagal menyimpan informasi pendaftaran.');
  }
};


exports.toggleAktif = async (req, res) => {
  try {
    const ukmId = req.session.user.ukm_id;
    const info = await PendaftaranInfo.findOne({ where: { ukm_id: ukmId } });

    if (!info) {
      req.flash('error', 'Informasi belum tersedia');
      return res.redirect('/adminukm/pendaftaran/info');
    }

    const newStatus = !info.aktif;
    await info.update({ aktif: newStatus });

    const statusText = newStatus ? 'diaktifkan' : 'dinonaktifkan';
    req.flash('success', `Pendaftaran berhasil ${statusText}.`);
    res.redirect('/adminukm/pendaftaran/info');
  } catch (err) {
    console.error('Gagal toggle status pendaftaran:', err);
    req.flash('error', 'Terjadi kesalahan saat mengubah status.');
    res.redirect('/adminukm/pendaftaran/info');
  }
};

exports.formEdit = async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  const info = await PendaftaranInfo.findOne({ where: { ukm_id: ukmId } });

  res.render('adminukm/pendaftaran/edit', {
    user: req.session.user,
    info
  });
};
