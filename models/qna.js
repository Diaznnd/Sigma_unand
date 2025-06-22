// models/qna.js
module.exports = (sequelize, DataTypes) => {
  const qna = sequelize.define('qna', {
    userName: DataTypes.STRING,
    activityCategory: DataTypes.STRING,
    questionTitle: DataTypes.STRING,
    questionContent: DataTypes.TEXT,
    priority: DataTypes.STRING
    
  }, {});
  return qna;
};