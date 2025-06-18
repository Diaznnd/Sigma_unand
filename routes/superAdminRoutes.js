// routes/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated, isSuperAdmin } = require('../middleware/auth');
const db = require('../models');
const User = db.User;


// Halaman dashboard super admin
router.get('/', isAuthenticated, isSuperAdmin, (req, res) => {
  res.render('superadmin/dashboard', { user: req.session.user });
});

// Kelola pengguna
// Kelola pengguna dengan statistik
router.get('/users', isAuthenticated, isSuperAdmin, async (req, res) => {
  const users = await User.findAll({ where: { role: ['pengguna', 'admin_ukm'] } });

  const totalUsers = users.length;
  const totalAdminUKM = users.filter(u => u.role === 'admin_ukm').length;
  const activeUsers = users.length; // Ganti jika kamu punya flag aktif di DB

  const stats = {
    totalUsers,
    totalAdminUKM,
    activeUsers
  };

  res.render('superadmin/kelolaPengguna', {
    users,
    stats,
    user: req.session.user
  });
});


// Ubah role pengguna
router.post('/users/:id/role', isAuthenticated, isSuperAdmin, async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  await User.update({ role }, { where: { id: userId } });
  res.redirect('/superadmin/users');
});

module.exports = router;
