const { Organisasi } = require('../models');

module.exports = async function setUKM(req, res, next) {
  // Cek apakah user sudah login dan punya ukm_id
  if (req.session.user && req.session.user.ukm_id) {
    try {
      const ukm = await Organisasi.findByPk(req.session.user.ukm_id);
      res.locals.ukm = ukm || null; // Variabel ini otomatis tersedia di EJS
    } catch (err) {
      console.error("Gagal mengambil data UKM:", err);
      res.locals.ukm = null;
    }
  } else {
    res.locals.ukm = null;
  }

  next();
};
