// models/Kolaborasi.js
module.exports = (sequelize, DataTypes) => {
  const Kolaborasi = sequelize.define('Kolaborasi', {
    ukmPengaju: DataTypes.STRING,
    ukmTujuan: DataTypes.STRING,
    judul: DataTypes.STRING,
    jenis: DataTypes.STRING,
    targetPeserta: DataTypes.INTEGER,
    tanggalMulai: DataTypes.DATEONLY,
    tanggalSelesai: DataTypes.DATEONLY,
    lokasi: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    tujuan: DataTypes.TEXT,
    kontribusi: DataTypes.TEXT,
    anggaran: DataTypes.INTEGER,
    sumberDana: DataTypes.STRING,
    rincianAnggaran: DataTypes.TEXT,
    penanggungJawab: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    noTelepon: DataTypes.STRING,
    email: DataTypes.STRING,
  });

  return Kolaborasi;
};
