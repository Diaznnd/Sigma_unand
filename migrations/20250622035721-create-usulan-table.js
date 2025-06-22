'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usulan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaPengusul: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nim: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ukm: {
        type: Sequelize.STRING
      },
      kategori: {
        type: Sequelize.STRING
      },
      judulKegiatan: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      tanggal: {
        type: Sequelize.DATEONLY
      },
      waktuMulai: {
        type: Sequelize.TIME
      },
      waktuSelesai: {
        type: Sequelize.TIME
      },
      lokasi: {
        type: Sequelize.STRING
      },
      estimasiPeserta: {
        type: Sequelize.INTEGER
      },
      anggaran: {
        type: Sequelize.INTEGER
      },
      catatan: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Menunggu'
      },
      ukm_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Organisasis',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usulan');
  }
};
