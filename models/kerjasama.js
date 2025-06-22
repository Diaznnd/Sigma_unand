'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kerjasama extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kerjasama.init({
    nama: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    ukm: DataTypes.STRING,
    tentang: DataTypes.STRING,
    detail: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kerjasama',
  });
  return Kerjasama;
};