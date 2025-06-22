// 1. MODEL: models/Penilaian.js
module.exports = (sequelize, DataTypes) => {
  const Penilaian = sequelize.define("Penilaian", {
    penyelenggara: DataTypes.STRING,
    kegiatan: DataTypes.STRING,
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    overall: DataTypes.INTEGER,
    content: DataTypes.INTEGER,
    speaker: DataTypes.INTEGER,
    organization: DataTypes.INTEGER,
    facilities: DataTypes.INTEGER,
    liked: DataTypes.TEXT,
    suggestions: DataTypes.TEXT,
    recommend: DataTypes.STRING,
    additional_comments: DataTypes.TEXT,
  });

  

  return Penilaian;
};