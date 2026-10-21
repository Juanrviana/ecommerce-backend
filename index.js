const express = require('express');
const cors = require('cors');
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

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});