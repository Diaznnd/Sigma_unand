const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdminUKM } = require('../middleware/auth');
const dokumenController = require('../controllers/adminDokumenController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Tampilkan daftar dokumen
router.get('/', isAuthenticated, isAdminUKM, dokumenController.index);

// Tampilkan form tambah
router.get('/tambah', isAuthenticated, isAdminUKM, dokumenController.tambahForm);

// Simpan dokumen
router.post('/tambah', isAuthenticated, isAdminUKM, upload.single('file'), dokumenController.simpan);

// Hapus dokumen
router.post('/hapus/:id', isAuthenticated, isAdminUKM, dokumenController.hapus);

module.exports = router;
