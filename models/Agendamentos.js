const Sequelize = require('sequelize')
const db = require('./db')
const Equipamentos = require('./Equipamentos')
const Professores = require('./Professores')

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
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    aula: {
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

Agendamentos.belongsTo(Equipamentos, {
    foreignKey: 'equipamentoId',
    allowNull: false,
    onDelete: 'CASCADE'
});

Agendamentos.belongsTo(Professores, {
    foreignKey: 'professorId',
    allowNull: false,
    onDelete: 'CASCADE'
});

Agendamentos.afterCreate((agendamento, options) => {
    Equipamentos.findByPk(agendamento.equipamentoId)
        .then(equipamento => {
            equipamento.quantidade -= 1;
            return equipamento.save();
        })
        .catch(err => console.log(err));
});




// Professores.hasOne(Agendamentos, {
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
// });
// Agendamentos.sync();
// Agendamentos.sync({ alter: true })
// Agendamentos.sync({ force: true })

module.exports = Agendamentos