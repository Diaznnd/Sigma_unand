// 'use strict';

// module.exports = (sequelize, DataTypes) => {
//   const Usulan = sequelize.define('Usulan', {
//     namaPengusul: DataTypes.STRING,
//     nim: DataTypes.STRING,
//     ukm: DataTypes.STRING,
//     kategori: DataTypes.STRING,
//     judulKegiatan: DataTypes.STRING,
//     deskripsi: DataTypes.TEXT,
//     tanggal: DataTypes.DATEONLY,
//     waktuMulai: DataTypes.TIME,
//     waktuSelesai: DataTypes.TIME,
//     lokasi: DataTypes.STRING,
//     estimasiPeserta: DataTypes.INTEGER,
//     anggaran: DataTypes.INTEGER,
//     catatan: DataTypes.TEXT,
//     status: {
//       type: DataTypes.STRING,
//       defaultValue: 'Menunggu' // default status
//     },
//     ukm_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     }
//   });

//   // 👇 Tambahkan relasi ke Organisasi
//   Usulan.associate = function(models) {
//     Usulan.belongsTo(models.Organisasi, {
//       foreignKey: 'ukm_id',
//       as: 'organisasi'
//     });
//   };

//   return Usulan;
// };
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usulan = sequelize.define('Usulan', {
    namaPengusul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nim: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false
    },
    judulKegiatan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ukm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    waktuMulai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    waktuSelesai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estimasiPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    anggaran: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Menunggu' // default status awal
    },
    ukm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Organisasis', // Sesuaikan nama tabel Organisasi di DB
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    }
  });

  // Relasi: Usulan milik satu Organisasi (UKM)
  Usulan.associate = function (models) {
    Usulan.belongsTo(models.Organisasi, {
      foreignKey: 'ukm_id',
      as: 'organisasi'
    });
  };

  return Usulan;
};
