const express = require('express')
const app = express()
const db = require('./models/db')
require('dotenv').config()

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Adiciona a extensão do arquivo
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));


const Equipamentos = require('./models/Equipamentos')
const Professores = require('./models/Professores')
const Agendamentos = require('./models/Agendamentos')

const cors = require('cors')
const { where, Model } = require('sequelize')

const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { profile } = require('console');

app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('api funcionando')
})

//rota privada
app.get('/professor/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const professor = await Professores.findByPk(id, {
        attributes: { exclude: ['password'] }
    });


    if (!professor) {
        return res.status(400).json({ msg: "professor não encontrado" })
    }

    res.status(200).json(professor)
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: "acesso negado" })
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()


    } catch (error) {
        res.status(400).json({ msg: "token invalido" })
    }
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Todos os campos devem ser preenchidos!",
        });
    }

    const professor = await Professores.findOne({ where: { email: req.body.email } });
    if (!professor) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha incorretos",
        });
    }

    const checkPassword = await bcrypt.compare(password, professor.password)

    if (!checkPassword) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha incorretos",
        });
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: professor.id
        }, secret
        )

        res.status(200).json({ msg: "professor autenticado com sucesso", token })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            msg: "ocorreu um erro no servidor"
        })
    }
})


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
        // Verifique se os dados existem antes de tentar mapeá-los
        if (!data) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não há dados para mapear!",
            });
        }

        // Modifique os objetos de professor para incluir a URL da imagem
        const professores = data.map(professor => ({
            ...professor.dataValues,
            foto: professor.foto
        }));

        return res.json({
            erro: false,
            professores
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro ao buscar dados",
        });
    });
});

app.post('/cad-professor', upload.single('foto'), async (req, res) => {
    // Verifique se já existe um professor com o mesmo e-mail
    const existingProfessor = await Professores.findOne({ where: { email: req.body.email } });
    if (existingProfessor) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Já existe um professor cadastrado com este e-mail!",
        });
    }

    const { nome, email, password } = req.body;

    // Verifique se todos os campos foram preenchidos
    if (!nome || !email || !password) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Todos os campos devem ser preenchidos!",
        });
    }

    // Verifique se a senha tem pelo menos 6 dígitos
    if (password.length < 6) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: A senha deve ter pelo menos 6 dígitos!",
        });
    }

    // Cria a senha
    const salt = await bcrypt.genSalt(15)
    const passwordHash = await bcrypt.hash(password, salt)

    req.body.password = passwordHash
    if (req.file) {
        req.body.foto = `http://localhost:8080/${req.file.path}`
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


app.put('/edit-professor/:id', upload.single('foto'), async (req, res) => {
    let { password } = req.body;

    // Verifique se a senha tem mais de 6 dígitos
    if (password.length <= 6) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: a senha deve ter mais de 6 dígitos!",
        });
    }

    // Aqui você pode editar a senha antes de criptografar
    const senhaCriptografada = await bcrypt.hash(password, 15);

    // Verifique se uma nova foto foi enviada
    if (req.file) {
        req.body.foto = `http://localhost:8080/${req.file.path}`;
    }

    await Professores.update({ ...req.body, password: senhaCriptografada }, { where: { 'id': req.params.id } }).then(() => {
        return res.json({
            erro: false,
            mensagem: "Professor editado com sucesso!",
        });
    })
        .catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Professor não editado com sucesso!",
            });
        });
});



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
    const existingAgendamento = await Agendamentos.findOne({ where: { data: req.body.data, aula: req.body.aula, professorId: req.body.professorId, equipamentoId: req.body.equipamentoId } });
    if (existingAgendamento) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Já existe um agendamento para esta data e horário!",
        });
    }

    const equipamento = await Equipamentos.findByPk(req.body.equipamentoId);
    if (equipamento.quantidade === 0) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Não há equipamentos disponíveis para agendamento!",
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
    const agendamentoEquipamento = await Agendamentos.findAll({
        where: { professorId: req.params.id },
        include: [
            { model: Equipamentos },
            { model: Professores } // Inclua o modelo Professores aqui
        ]
    })
    return res.json(agendamentoEquipamento)
})

app.listen(8080, () => { console.log('rodando') })