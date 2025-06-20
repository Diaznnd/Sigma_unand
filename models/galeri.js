'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Galeri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Galeri.init({
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    jenis: DataTypes.STRING,
    referensi_id: DataTypes.INTEGER,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Galeri',
    
  });

  Galeri.associate = function(models) {
  Galeri.belongsTo(models.Organisasi, { foreignKey: 'ukm_id', as: 'organisasi' });
  Galeri.hasMany(models.GaleriItem, { foreignKey: 'galeri_id', as: 'items', onDelete: 'CASCADE' });
};

  return Galeri;
};