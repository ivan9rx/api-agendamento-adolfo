const Sequelize = require("sequelize");
require('dotenv').config()
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  port: process.env.PORT
});

sequelize
  .authenticate()
  .then(() => {
    console.log("conexao com banco de dados realizada");
  })
  .catch(() => {
    console.log("conexao com banco de dados não realizada");
  });

module.exports = sequelize;