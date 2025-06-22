module.exports = (sequelize, DataTypes) => {
  const Galeri = sequelize.define("Galeri", {
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    gambar: DataTypes.STRING, // Nama file atau URL gambar
    tanggal: DataTypes.DATE,
    ukm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Organisasis', // sesuaikan
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  });

  Galeri.associate = function(models) {
    Galeri.belongsTo(models.Organisasi, {
      foreignKey: 'ukm_id',
      as: 'organisasi'
    });
  };

  return Galeri;
};
