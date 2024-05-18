const Sequelize = require("sequelize");
const sequelize = new Sequelize('afs', 'avnadmin', 'AVNS_Yy7iU-jbI_H-KGiejIB', {
  host: 'clinica-database-clinica-odontologica.a.aivencloud.com',
  dialect: 'mysql',
  port: 20893
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