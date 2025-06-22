'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organisasi = sequelize.define('Organisasi', {
    namaOrg: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    tanggalPengajuan: DataTypes.DATE,
    tanggalBerdiri: DataTypes.DATE,
    status: DataTypes.CHAR,
    logo: DataTypes.STRING,
    instagram: DataTypes.STRING,
    website: DataTypes.STRING,
    visi: DataTypes.TEXT,        // ditambahkan
    misi: DataTypes.TEXT,        // ditambahkan
    alamat: DataTypes.STRING,    // ditambahkan
    kontak: DataTypes.STRING,    // ditambahkan
    jenis: DataTypes.STRING, // Jenis UKM seperti: Olahraga, Seni, Akademik, dll
    userId: DataTypes.INTEGER
  }, {});

  Organisasi.associate = function(models) {
    Organisasi.hasMany(models.Berita, { foreignKey: 'ukm_id' });
    Organisasi.belongsTo(models.User, { foreignKey: 'userId' });
    Organisasi.hasOne(models.PendaftaranInfo, { foreignKey: 'ukm_id', as: 'PendaftaranInfo'});
  };

  return Organisasi;
};
