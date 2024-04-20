const Sequelize = require('sequelize')
const db = require('./db')

const Professores = db.define('professores', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto: {
        type: Sequelize.STRING,
        allowNull: true,
    },
})


//           
// Professores.sync();
// Professores.sync({ alter: true })

module.exports = Professores