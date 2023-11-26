const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { Funcionario, Produtos, FuncionarioProduto } = require('./dao/db');

async function testarConexao() {
    try {
      // Sincronizar as tabelas com o banco de dados
      await Produtos.sequelize.sync();
      await Funcionario.sequelize.sync();
      await FuncionarioProduto.sequelize.sync();
  
      console.log('Conexão bem-sucedida.');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
  }
  

testarConexao();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home', 'index.html'));
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cadastro.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'registro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

// Rota para cadastro de produtos
app.post('/cadastro', async (req, res) => {
    console.log(req.body); 
    const { nome, descricao, valor, quantidade, categorias } = req.body;

    try {
        const novoProduto = await Produtos.create({
            nome,
            descricao,
            valor,
            quantidade,
            categorias
        });

        res.status(201).json({ success: true, produto: novoProduto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Rota para registro de funcionários
app.post('/registro-funcionario', async (req, res) => {
    console.log(req.body); 
    const { nome, cargo, email, senha } = req.body;

    try {
        const novoFuncionario = await Funcionario.create({
            nome,
            cargo,
            email,
            senha
        });

        res.status(201).json({ success: true, funcionario: novoFuncionario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Email recebido:', email);
    console.log('Senha recebida:', password);

    try {
        // Buscar funcionário pelo e-mail
        const funcionario = await Funcionario.findOne({ where: { email } });

        console.log('Funcionário encontrado:', funcionario);

        // Verificar se o funcionário existe e a senha está correta
        if (funcionario) {
            res.status(200).json({ success: true, funcionario: { nome: funcionario.nome } });

        } else {
            res.status(401).json({ success: false, error: 'Credenciais inválidas' });
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Adicione mais rotas e controladores conforme necessário

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
