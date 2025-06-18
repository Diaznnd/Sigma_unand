// middleware/auth.js

exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect('/auth/login');
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'super_admin') return next();
  return res.status(403).send('Akses ditolak: Super Admin Only');
};

exports.isAdminUKM = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin_ukm') return next();
  return res.status(403).send('Akses ditolak: Admin UKM Only');
};

exports.isPenggunaUmum = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'pengguna') return next();
  return res.status(403).send('Akses ditolak: Pengguna Umum Only');
};
