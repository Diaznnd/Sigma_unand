'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Masalah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Masalah.init({
    nama_ukm: DataTypes.STRING,
    masalah: DataTypes.TEXT,
    tanggal: DataTypes.DATE 
  }, {
    sequelize,
    modelName: 'Masalah',
  });
  return Masalah;
};