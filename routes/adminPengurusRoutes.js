// routes/adminPengurusRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdminUKM } = require('../middleware/auth');
const pengurusController = require('../controllers/adminPengurusController');

// Setup penyimpanan file foto pengurus
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 6)}${ext}`);
  }
});
const upload = multer({ storage });

// === Rute-rute untuk struktur kepengurusan ===
router.get('/', isAuthenticated, isAdminUKM, pengurusController.index);

router.get('/tambah', isAuthenticated, isAdminUKM, pengurusController.formTambah);
router.post('/tambah', isAuthenticated, isAdminUKM, upload.single('foto'), pengurusController.simpan);

router.get('/edit/:id', isAuthenticated, isAdminUKM, pengurusController.formEdit);
router.post('/edit/:id', isAuthenticated, isAdminUKM, upload.single('foto'), pengurusController.update);

router.post('/hapus/:id', isAuthenticated, isAdminUKM, pengurusController.hapus);

module.exports = router;
