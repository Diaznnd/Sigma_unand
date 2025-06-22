
// models/pendaftaran.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pendaftaran extends Model {
    static associate(models) {
      Pendaftaran.belongsTo(models.Organisasi, {
        foreignKey: 'ukm_id',
        as: 'organisasi'
      });
    }
  }
  Pendaftaran.init({
    deskripsi: DataTypes.TEXT,
    aktif: DataTypes.BOOLEAN,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pendaftaran',
  });
  return Pendaftaran;
};
