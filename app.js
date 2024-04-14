const express = require('express')
const app = express()
const db = require('./models/db')

const Equipamentos = require('./models/Equipamentos')
const Professores = require('./models/Professores')
const Agendamentos = require('./models/Agendamentos')

const cors = require('cors')
const { where } = require('sequelize')

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
    await Equipamentos.create(req.body).then(() => {
        return res.json({
            erro: false,
            mensagem: "Equipamento cadastrado com sucesso!",
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Equipamento não cadastrado com sucesso!",
        });
    });
})

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
    await Professores.create(req.body).then(() => {
        return res.json({
            erro: false,
            mensagem: "professor cadastrado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: professor não cadastrado com sucesso!",
            });
        });
})

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
    await Agendamentos.create(req.body).then(() => {
        return res.json({
            erro: false,
            mensagem: "Agendamento feito com sucesso!",
        });
    }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Agendamento não foi efetuado com sucesso!",
            });
        });
})

app.listen(8080, () => { console.log('rodando') })