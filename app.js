const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); 
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const app = express();
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminUkmRoutes = require('./routes/adminUkmRoutes');
const adminBeritaRoutes = require('./routes/adminBeritaRoutes');
const adminKegiatanRoutes = require('./routes/adminKegiatanRoutes');
const setUKM = require('./middleware/setUKM');
const penggunaRoutes = require('./routes/userdashboard');
const adminGaleriRoutes = require('./routes/adminGaleriRoutes');
const adminPengurusRoutes = require('./routes/adminPengurusRoutes');
const adminDokumenRoutes = require('./routes/adminDokumenRoutes');
const adminFormFieldRoutes = require('./routes/adminFormFieldRoutes');
const userberita = require('./routes/userberita');
const userKegiatan = require('./routes/userkegiatan');


app.use(session({
  secret: 'sigma-unand-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'sigma_unand_rahasia', resave: false, saveUninitialized: true }));
// Middleware yang inject ukm ke semua view EJS
app.use(setUKM);
             

// Routes
app.use('/auth', authRoutes);
app.use('/superadmin', superAdminRoutes);
app.use('/adminukm', adminUkmRoutes);
app.use('/adminukm/berita', adminBeritaRoutes);
app.use('/adminukm/kegiatan', adminKegiatanRoutes);
app.use('/pengguna', penggunaRoutes);
app.use("/adminukm/galeri", adminGaleriRoutes);
app.use('/adminukm/pengurus', adminPengurusRoutes);
app.use('/adminukm/dokumen', adminDokumenRoutes);
app.use('/adminukm/form', adminFormFieldRoutes);
app.use('/user', userberita); // misalnya kamu akses via /pengguna/berita
app.use('/user', userKegiatan); // cukup ini saja

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.set('layout', 'layouts/layout');

const { isAuthenticated, isSuperAdmin, isAdminUKM, isPenggunaUmum } = require('./middleware/auth');

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
  res.render('user/dashboard', {user: req.session.user});
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



// DB
// DB
const db = require('./models');
const sequelize = db.sequelize;

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server running di http://localhost:3000'));
});