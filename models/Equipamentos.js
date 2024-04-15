const Sequelize = require('sequelize')
const db = require('./db')


const Equipamentos = db.define('equipamentos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

// Equipamentos.hasMany(Agendamentos, {
//     foreignKey: {
//       name: 'equipamentoId',
//       allowNull: false,
//     },
//     onDelete: 'CASCADE',
//   });



// Equipamentos.sync({ alter: true })
// Equipamentos.sync();
Equipamentos.sync({ alter: true })

module.exports = Equipamentos