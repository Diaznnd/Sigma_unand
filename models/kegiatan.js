'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kegiatan extends Model {
    static associate(models) {
      // Relasi ke model Organisasi (UKM)
      Kegiatan.belongsTo(models.Organisasi, {
        foreignKey: 'ukm_id',
        as: 'organisasi'
      });
    }
  }
  Kegiatan.init({
    nama: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    tanggal: DataTypes.DATE,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Kegiatan',
  });
  return Kegiatan;
};
