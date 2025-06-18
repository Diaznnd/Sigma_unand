module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    nim: {
      type: DataTypes.STRING,
      unique: true
    },
    major: DataTypes.STRING,
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('pengguna', 'admin_ukm', 'super_admin'),
      defaultValue: 'pengguna'
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ukm_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  return User;
};
