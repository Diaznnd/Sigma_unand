'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Pengurus = sequelize.define('Pengurus', {
    nama: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    periode: DataTypes.STRING,
    foto: DataTypes.STRING,
    ukm_id: DataTypes.INTEGER
  }, {});
  
  Pengurus.associate = function(models) {
    Pengurus.belongsTo(models.Organisasi, { foreignKey: 'ukm_id' });
  };

  return Pengurus;
};