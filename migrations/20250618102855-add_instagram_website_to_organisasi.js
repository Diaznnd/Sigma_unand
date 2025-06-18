'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Organisasis', 'instagram', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Organisasis', 'website', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Organisasis', 'instagram');
    await queryInterface.removeColumn('Organisasis', 'website');
  }
};
