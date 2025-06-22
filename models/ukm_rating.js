module.exports = (sequelize, DataTypes) => {
  const UkmRating = sequelize.define('ukm_rating', {
    ukm_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama_user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    ulasan: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'ukm_ratings'
  });

  return UkmRating;
};
