const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mysql = require('mysql2/promise');
const pdfMake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs');

// Import middleware dan routes
const setUKM = require('./middleware/setUKM');
const { isAuthenticated, isSuperAdmin, isAdminUKM, isPenggunaUmum } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminUkmRoutes = require('./routes/adminUkmRoutes');
const adminBeritaRoutes = require('./routes/adminBeritaRoutes');
const adminKegiatanRoutes = require('./routes/adminKegiatanRoutes');
const penggunaRoutes = require('./routes/userdashboard');
const adminGaleriRoutes = require('./routes/adminGaleriRoutes');
const adminPengurusRoutes = require('./routes/adminPengurusRoutes');
const adminDokumenRoutes = require('./routes/adminDokumenRoutes');
const adminFormFieldRoutes = require('./routes/adminFormFieldRoutes');
const userberita = require('./routes/userberita');
const userKegiatan = require('./routes/userkegiatan');
const forumRouter = require('./routes/forumRouter');
const ukmRouter = require('./routes/ukmrouter');
const userKalenderRoutes = require('./routes/userkalender');
const userDetailBeritaRoutes = require('./routes/userdetailberita');

// Setup pdfMake
pdfMake.vfs = vfsFonts.vfs;

const app = express();

// Setup view engine dan layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(session({
  secret: 'sigma_unand_rahasia',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

app.use(setUKM);

// DB Connection Pool for direct queries
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sigma_unand',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};
const pool = mysql.createPool(dbConfig);
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routing
app.use('/auth', authRoutes);
app.use('/superadmin', superAdminRoutes);
app.use('/adminukm', adminUkmRoutes);
app.use('/adminukm/berita', adminBeritaRoutes);
app.use('/adminukm/kegiatan', adminKegiatanRoutes);
app.use('/pengguna', penggunaRoutes);
app.use('/adminukm/galeri', adminGaleriRoutes);
app.use('/adminukm/pengurus', adminPengurusRoutes);
app.use('/adminukm/dokumen', adminDokumenRoutes);
app.use('/adminukm/form', adminFormFieldRoutes);
app.use('/user', userberita);
app.use('/user', userKegiatan);
app.use('/user', userKalenderRoutes);
app.use('/berita', userDetailBeritaRoutes);
app.use('/forum', forumRouter);
app.use('/', ukmRouter(pool, pdfMake));

// Redirect root
app.get('/', (req, res) => res.redirect('/auth/login'));

// Dashboard by role
app.get('/dashboard', isAuthenticated, (req, res) => {
  const role = req.session.user.role;
  if (role === 'super_admin') return res.redirect('/superadmin');
  if (role === 'admin_ukm') return res.redirect('/adminukm');
  return res.redirect('/pengguna');
});

app.get('/superadmin', isAuthenticated, isSuperAdmin, (req, res) => {
  res.render('superadmin/dashboard', { user: req.session.user });
});

app.get('/adminukm', isAuthenticated, isAdminUKM, (req, res) => {
  res.render('adminukm/dashboard', { user: req.session.user });
});

app.get('/pengguna', isAuthenticated, isPenggunaUmum, (req, res) => {
  res.render('user/dashboard', { user: req.session.user });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
app.use('/uploads', express.static('uploads'));

//deatil berita
// Aktifkan folder public untuk file statis (CSS, JS, dll)
app.use(express.static(path.join(__dirname, 'public')));

// Spesifik untuk folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routing halaman detail berita
const userDetailBeritaRoutes = require('./routes/userdetailberita');
app.use('/berita', userDetailBeritaRoutes);


//kegiatan
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//kalender
const userKalenderRoutes = require('./routes/userkalender');
app.use('/user', userKalenderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  try {
    res.status(500).render('user/error', {
      message: 'Terjadi kesalahan pada server',
      backUrl: req.get('Referrer') || '/'
    });
  } catch (renderErr) {
    res.status(500).send('<h1>500 - Internal Server Error</h1><p>Gagal merender halaman error.</p>');
  }
});


// DB
// DB
const db = require('./models');
const sequelize = db.sequelize;

sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Server berjalan di http://localhost:${port}`);
  });
});
