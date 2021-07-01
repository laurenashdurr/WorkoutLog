const Sequelize = require('sequelize');
const sequelize = new Sequelize(`postgres://postgres:${process.env.DB_SECRET}@localhost:5432/wol-server`);

module.exports = sequelize;