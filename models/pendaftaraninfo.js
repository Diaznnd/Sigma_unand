'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PendaftaranInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PendaftaranInfo.init({
    deskripsi: DataTypes.TEXT,
    aktif: DataTypes.BOOLEAN,
    file1: DataTypes.STRING,
    file2: DataTypes.STRING,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PendaftaranInfo',
  });

  PendaftaranInfo.associate = function(models) {
    PendaftaranInfo.belongsTo(models.Organisasi, {foreignKey: 'ukm_id',as: 'Organisasi'});
  };

  

  return PendaftaranInfo;
};