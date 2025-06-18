const express = require('express');
const router = express.Router();
const controller = require('../controllers/authcontroller'); // authcontroller.js
const { isAuthenticated } = require('../middleware/auth');


router.get('/login', controller.showLogin);
router.post('/login', controller.login);
router.get('/register', controller.showRegister);
router.post('/register', controller.register);
router.get('/logout', controller.logout);

router.get('/dashboard', isAuthenticated, (req, res) => {
  const role = req.session.user.role;
  if (role === 'super_admin') return res.redirect('/superadmin');
  if (role === 'admin_ukm') return res.redirect('/adminukm');
  return res.redirect('/pengguna');
});


module.exports = router;
