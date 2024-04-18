const express = require('express')
const app = express()
const db = require('./models/db')

const Equipamentos = require('./models/Equipamentos')
const Professores = require('./models/Professores')
const Agendamentos = require('./models/Agendamentos')

const cors = require('cors')
const { where, Model } = require('sequelize')

const Sequelize = require('sequelize')

app.use(cors())
app.use(express.json())




app.get('/list-equipamentos', async (req, res) => {

    await Equipamentos.findAll().then((data) => {
        return res.json({
            erro: false,
            data
        })
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "erro ao buscar dados",
        });
    });

})

app.post('/cad-equipamento', async (req, res) => {
    // Verifique se já existe um equipamento com o mesmo nome
    const existingEquipamento = await Equipamentos.findOne({ where: { nome: req.body.nome } });
    if (existingEquipamento) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Já existe um equipamento cadastrado com este nome!",
        });
    }

    // Se não existir, crie um novo equipamento
    await Equipamentos.create(req.body).then(() => {
        return res.json({
            erro: false,
            mensagem: "Equipamento cadastrado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Equipamento não cadastrado com sucesso!",
            });
        });
});


app.put('/edit-equipamento/:id', async (req, res) => {
    await Equipamentos.update(req.body, { where: { 'id': req.params.id } }).then(() => {
        return res.json({
            erro: false,
            mensagem: "equipamento editado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: equipamento não editado com sucesso!",
            });
        });
})

app.delete('/delete-equipamento/:id', async (req, res) => {
    const numDestroyed = await Equipamentos.destroy({ where: { id: req.params.id } });
    if (numDestroyed === 0) {
        return res.json({
            erro: true,
            mensagem: "Nenhum equipamento encontrado com o id fornecido!",
        });
    } else {
        return res.json({
            erro: false,
            mensagem: "Equipamento deletado com sucesso!",
        });
    }
});


app.get('/list-professores', async (req, res) => {

    await Professores.findAll().then((data) => {
        return res.json({
            erro: false,
            data
        })
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "erro ao buscar dados",
        });
    });

})
app.post('/cad-professor', async (req, res) => {
    // Verifique se já existe um professor com o mesmo e-mail
    const existingProfessor = await Professores.findOne({ where: { email: req.body.email } });
    if (existingProfessor) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Já existe um professor cadastrado com este e-mail!",
        });
    }

    // Se não existir, crie um novo professor
    await Professores.create(req.body).then(() => {
        return res.json({
            erro: false,
            mensagem: "Professor cadastrado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Professor não cadastrado com sucesso!",
            });
        });
});


app.put('/edit-professor/:id', async (req, res) => {
    await Professores.update(req.body, { where: { 'id': req.params.id } }).then(() => {
        return res.json({
            erro: false,
            mensagem: "professor editado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: professor não editado com sucesso!",
            });
        });
})

app.delete('/delete-professor/:id', async (req, res) => {
    await Professores.destroy({ where: { 'id': req.params.id } }).then(() => {
        return res.json({
            erro: false,
            mensagem: "professor deletado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: professor não foi deletado com sucesso!",
            });
        });
})


app.post('/criar-agendamento', async (req, res) => {
    // Verifique se já existe um agendamento com a mesma data e horário
    const existingAgendamento = await Agendamentos.findOne({ where: { data: req.body.data, aula: req.body.aula } });
    if (existingAgendamento) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Já existe um agendamento para esta data e horário!",
        });
    }

    // Se não existir, crie um novo agendamento
    await Agendamentos.create(req.body).then(() => {
        return res.json({
            erro: false,
            mensagem: "Agendamento efetuado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Agendamento não foi efetuado com sucesso!",
            });
        });
});


app.get('/agendamentos', async (req, res) => {
    await Agendamentos.findAll().then((data) => {
        if (data.length === 0) {
            return res.status(404).json({
                mensagem: "Nenhum agendamento encontrado",
            });
        } else {
            return res.json({
                erro: false,
                data
            });
        }
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro ao buscar dados",
        });
    });
});


app.get('/agendamentos/professor/:id', async (req, res) => {

    const agendamentoEquipamento = await Agendamentos.findAll({ where: { professorId: req.params.id }, include: [{ model: Equipamentos }] })
    return res.json(agendamentoEquipamento)
    // await Professores.findAll({
    //     where: { id: req.params.id },
    //     include: [{ model: Agendamentos }]
    // }).then((data) => {
    //     return res.json({
    //         erro: false,
    //         data
    //     })
    // }).catch(() => {
    //     return res.status(400).json({
    //         erro: true,
    //         mensagem: "erro ao buscar dados",
    //     });
    // });
})

app.listen(8080, () => { console.log('rodando') })