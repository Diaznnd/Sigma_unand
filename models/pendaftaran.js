module.exports = (sequelize, DataTypes) => {
  const Pendaftaran = sequelize.define('Pendaftaran', {
    ukm_id: DataTypes.INTEGER,
    ukm_nama: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    nim: DataTypes.STRING,
    email: DataTypes.STRING,
    no_telepon: DataTypes.STRING,
    fakultas: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    angkatan: DataTypes.STRING,
    semester: DataTypes.STRING,
    motivasi: DataTypes.TEXT,
    pengalaman: DataTypes.TEXT,
    keahlian: DataTypes.STRING,
    tanggal_daftar: DataTypes.DATE,
    status_pendaftaran: DataTypes.ENUM('pending', 'approved', 'rejected')
  }, {
    tableName: 'pendaftaran_ukm',
    timestamps: false
  });

  return Pendaftaran;
};
