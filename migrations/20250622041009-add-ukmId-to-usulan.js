'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usulans', 'ukm_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // sementara true agar tidak gagal
      references: {
        model: 'Organisasis',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usulans', 'ukm_id');
  }
};
