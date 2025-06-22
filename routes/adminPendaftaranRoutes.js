const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdminUKM } = require('../middleware/auth');
const pendaftaranController = require('../controllers/adminPendaftaranInfoController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`);
  }
});

const upload = multer({ storage });

router.get('/info', isAuthenticated, isAdminUKM, pendaftaranController.formInfo);
router.post('/info/edit', isAuthenticated, isAdminUKM, upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
]), pendaftaranController.simpanInfo);

// 🔄 Toggle aktif/nonaktif
router.post('/info/toggle', isAuthenticated, isAdminUKM, pendaftaranController.toggleAktif);
router.get('/edit', isAuthenticated, isAdminUKM, pendaftaranController.formEdit);


module.exports = router;
