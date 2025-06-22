'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      nim: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      major: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.TEXT
      },
      role: {
      type: Sequelize.ENUM('pengguna', 'admin_ukm', 'super_admin'),
        allowNull: false
      },
      refresh_token: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};