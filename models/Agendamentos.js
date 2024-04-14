const Sequelize = require('sequelize')
const db = require('./db')

const Agendamentos = db.define('agendamentos', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    professorId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    equipamentoId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    finished: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    canceled: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
})



// Professores.hasOne(Agendamentos, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
// });
// Agendamentos.sync();
// Agendamentos.sync({ alter: true })

module.exports = Agendamentos