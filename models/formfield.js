'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormField extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FormField.init({
    label: DataTypes.STRING,
    type: DataTypes.STRING,
    options: DataTypes.TEXT,
    required: DataTypes.BOOLEAN,
    ukm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FormField',
  });

  FormField.associate = function(models) {
  FormField.belongsTo(models.Organisasi, { foreignKey: 'ukm_id' });
  FormField.hasMany(models.FormResponseValue, { foreignKey: 'form_field_id' });
  };
  return FormField;
};