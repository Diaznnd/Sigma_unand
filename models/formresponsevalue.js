'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormResponseValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FormResponseValue.init({
    form_field_id: DataTypes.INTEGER,
    response_id: DataTypes.INTEGER,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FormResponseValue',
  });

  FormResponseValue.associate = function(models) {
  FormResponseValue.belongsTo(models.FormResponse, { foreignKey: 'response_id' });
  FormResponseValue.belongsTo(models.FormField, { foreignKey: 'form_field_id' });
  };
  return FormResponseValue;
};