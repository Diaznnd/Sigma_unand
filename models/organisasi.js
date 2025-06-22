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
    visi: DataTypes.TEXT,
    misi: DataTypes.TEXT,
    alamat: DataTypes.STRING,
    kontak: DataTypes.STRING,
    jenis: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});


  Organisasi.associate = function(models) {
    Organisasi.hasMany(models.Usulan, {
      foreignKey: 'ukm_id',
      as: 'usulans'
    });
  };

  return Organisasi;
};
