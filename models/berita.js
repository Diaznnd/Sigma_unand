'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Berita extends Model {
    static associate(models) {
      Berita.belongsTo(models.Organisasi, { foreignKey: 'ukm_id' });
    }
  }

  Berita.init({
    judul: DataTypes.STRING,
    isi: DataTypes.TEXT,
    gambar: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Berita',
  });

  return Berita;
};
