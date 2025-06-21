const { FormField } = require('../models');

exports.index = async (req, res) => {
  const ukmId = req.session.user.ukm_id;
  const fields = await FormField.findAll({ where: { ukm_id: ukmId } });

  res.render('adminukm/form/index', {
    user: req.session.user,
    fields
  });
};

exports.formTambah = (req, res) => {
  res.render('adminukm/form/tambah', { user: req.session.user });
};

exports.simpanField = async (req, res) => {
  const { label, type, required, options } = req.body;
  const ukmId = req.session.user.ukm_id;

  try {
    await FormField.create({
      label,
      type,
      required: required === 'on',
      options: options || null,
      ukm_id: ukmId
    });
    res.redirect('/adminukm/form');
  } catch (err) {
    console.error('Gagal menyimpan field:', err);
    res.status(500).send('Gagal menyimpan field');
  }
};

exports.formEdit = async (req, res) => {
  const field = await FormField.findByPk(req.params.id);
  if (!field) return res.status(404).send('Field tidak ditemukan');

  res.render('adminukm/form/edit', {
    user: req.session.user,
    field
  });
};

exports.updateField = async (req, res) => {
  const { label, type, required, options } = req.body;
  try {
    await FormField.update({
      label,
      type,
      required: required === 'on',
      options: options || null
    }, {
      where: { id: req.params.id }
    });

    res.redirect('/adminukm/form');
  } catch (err) {
    console.error('Gagal update field:', err);
    res.status(500).send('Gagal update field');
  }
};

exports.hapusField = async (req, res) => {
  try {
    await FormField.destroy({ where: { id: req.params.id } });
    res.redirect('/adminukm/form');
  } catch (err) {
    console.error('Gagal hapus field:', err);
    res.status(500).send('Gagal hapus field');
  }
};
