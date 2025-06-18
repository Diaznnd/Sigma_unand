'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'ukm_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Organisasis', // pastikan sesuai nama tabel di database
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'ukm_id');
  }
};
