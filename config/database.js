const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sigma_unand', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;
