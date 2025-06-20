// migrations/xxxx-create-pengurus.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pengurus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      periode: {
        type: Sequelize.STRING
      },
      foto: {
        type: Sequelize.STRING
      },
      ukm_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Organisasis',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Pengurus');
  }
};
