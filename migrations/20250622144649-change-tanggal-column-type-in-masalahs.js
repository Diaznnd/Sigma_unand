'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Perintah untuk mengubah kolom 'tanggal' menjadi tipe DATE
    await queryInterface.changeColumn('Masalahs', 'tanggal', {
      type: Sequelize.DATE,
      allowNull: true // Sesuaikan jika perlu
    });
  },

  async down (queryInterface, Sequelize) {
    // Perintah untuk mengembalikan jika migrasi di-undo
    await queryInterface.changeColumn('Masalahs', 'tanggal', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  }
};