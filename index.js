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

// Rota para testar a base de dados (Cria uma categoria de teste)
app.post('/api/categories', async (req, res) => {
    try {
        const { name, slug } = req.body;
        
        // Executa a query SQL para inserir na tabela 'categories'
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
        res.status(500).json({ error: "Erro ao criar categoria na base de dados." });
    }
}); 

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});