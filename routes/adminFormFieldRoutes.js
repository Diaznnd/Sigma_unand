const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdminUKM } = require('../middleware/auth');
const controller = require('../controllers/adminFormFieldController');

router.get('/', isAuthenticated, isAdminUKM, controller.index);
router.get('/tambah', isAuthenticated, isAdminUKM, controller.formTambah);
router.post('/tambah', isAuthenticated, isAdminUKM, controller.simpanField);
router.get('/edit/:id', isAuthenticated, isAdminUKM, controller.formEdit);
router.post('/edit/:id', isAuthenticated, isAdminUKM, controller.updateField);
router.post('/hapus/:id', isAuthenticated, isAdminUKM, controller.hapusField);
router.get('/export/pdf', isAuthenticated, isAdminUKM, controller.generatePDFForm);


module.exports = router;
