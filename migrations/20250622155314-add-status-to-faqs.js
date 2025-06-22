'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perintah untuk menambah kolom 'status' ke tabel 'Faqs'
    await queryInterface.addColumn('Faqs', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'pending', // Status default saat pertanyaan dibuat
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk menghapus kolom jika migrasi di-undo
    await queryInterface.removeColumn('Faqs', 'status');
  }
};