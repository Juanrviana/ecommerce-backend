const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./db'); // Importa o nosso conector da base de dados

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste simples
app.get('/', (req, res) => {
    res.json({ message: "API do E-commerce a funcionar com sucesso! 🚀" });
});

// --- CATEGORIAS ---

// Criar categoria
app.post('/api/categories', async (req, res) => {
    try {
        const { name, slug } = req.body;
        const result = await db.query(
            'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
            [name, slug]
        );
        res.status(201).json({
            message: "Categoria criada com sucesso na base de dados! 🎉",
            category: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar ctegoria." });
    }
});

/// --- PRODUTOS ---

// 1. Registrar um novo produto
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, stock_quantity, image_url, category_id } = req.body;

        const result = await db.query(
            `INSERT INTO products (name, description, price, stock_quantity, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, description, price, stock_quantity, image_url, category_id]
        );

        res.status(201).json({
            message: "Produto criado com sucesso!",
            product: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar produto."});
    }
});

// 2. Listar todos os produtos
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query(' SELECT * FROM products ORDER BY id DESC');
        res.json({
            total: result.rowCount,
            product: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar produtos." });
    }
});

// --- UTILIZADORES E AUTENTICAÇÃO ---

// 1. Registrar um novo utilizador
app.post('/api/register', async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        // Verificar se o utilizador já existe
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Este email já está registado."});
        }

        // Encriptar a password com segurança (salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Inserir o novo utilizador na base de dados
        const result = await db.query(
            `INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
            [name, email, passwordHash, role || 'customer']
        );

        res.status(201).json({
            message: "Utilizador registado com sucesso! ",
            user: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao registar utilizador."});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});