const bcrypt = require('bcrypt');
const User = require('../models/user');
const sequelize = require('../config/database');

(async () => {
  await sequelize.sync();

  const hash = await bcrypt.hash('super123', 10);

  const [user, created] = await User.findOrCreate({
    where: { email: 'super@unand.ac.id' },
    defaults: {
      first_name: 'Super',
      last_name: 'Admin',
      nim: '00000000',
      major: 'BEM Pusat',
      password_hash: hash,
      role: 'super_admin'
    }
  });

  if (created) {
    console.log('Super admin berhasil dibuat!');
  } else {
    console.log('Super admin sudah ada.');
  }

  process.exit();
})();
