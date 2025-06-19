'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kegiatan extends Model {
    static associate(models) {
      Kegiatan.belongsTo(models.Organisasi, {
        foreignKey: 'ukm_id',
        as: 'organisasi'
      });
    }
  }

  Kegiatan.init({
    judul: DataTypes.STRING,             // <- Ganti dari 'nama' ke 'judul'
    deskripsi: DataTypes.TEXT,
    tanggal: DataTypes.DATE,
    lokasi: DataTypes.STRING,           // <- Pastikan ini juga ada
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Kegiatan',
  });

  return Kegiatan;
};
