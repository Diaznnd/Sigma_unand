'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FormResponse.init({
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FormResponse',
  });

    FormResponse.associate = function(models) {
    FormResponse.belongsTo(models.Organisasi, { foreignKey: 'ukm_id' });
    FormResponse.hasMany(models.FormResponseValue, { foreignKey: 'response_id' });
    };
  return FormResponse;
};