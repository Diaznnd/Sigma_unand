'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Organisasis', 'visi', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Organisasis', 'misi', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('Organisasis', 'alamat', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('Organisasis', 'kontak', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Organisasis', 'visi');
    await queryInterface.removeColumn('Organisasis', 'misi');
    await queryInterface.removeColumn('Organisasis', 'alamat');
    await queryInterface.removeColumn('Organisasis', 'kontak');
  }
};
