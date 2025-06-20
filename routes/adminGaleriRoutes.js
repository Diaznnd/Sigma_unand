const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdminUKM } = require('../middleware/auth');
const galeriController = require('../controllers/adminGaleriController');

// Setup multer untuk upload gambar
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

router.get('/', isAuthenticated, isAdminUKM, galeriController.index);
router.get('/tambah', isAuthenticated, isAdminUKM, galeriController.showFormTambah);
router.post('/tambah', isAuthenticated, isAdminUKM, upload.array('gambar', 10), galeriController.tambah);
router.get('/edit/:id', isAuthenticated, isAdminUKM, galeriController.showFormEdit);
router.post('/edit/:id', isAuthenticated, isAdminUKM, upload.array('gambar', 10), galeriController.edit);
router.post('/hapus/:id', isAuthenticated, isAdminUKM, galeriController.hapus);
router.post('/:galeriId/hapus-gambar/:itemId', isAuthenticated, isAdminUKM, galeriController.hapusGambarSatuan);
router.get('/detail/:id', isAuthenticated, isAdminUKM, galeriController.showDetail);


module.exports = router;
