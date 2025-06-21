'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DokumenKegiatan extends Model {
    static associate(models) {
      DokumenKegiatan.belongsTo(models.Kegiatan, {
        foreignKey: 'kegiatan_id',
        as: 'kegiatan'
      });
      DokumenKegiatan.belongsTo(models.Organisasi, {
        foreignKey: 'ukm_id',
        as: 'organisasi'
      });
    }
  }
  DokumenKegiatan.init({
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    file: DataTypes.STRING,
    kegiatan_id: DataTypes.INTEGER,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DokumenKegiatan',
  });
  return DokumenKegiatan;
};
