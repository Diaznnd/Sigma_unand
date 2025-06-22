'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaporanAktivitas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LaporanAktivitas.init({
    judul: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    detail: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'LaporanAktivitas',
  });
  return LaporanAktivitas;
};