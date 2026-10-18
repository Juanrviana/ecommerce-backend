const { Pool } = require('pg');
require('dotenv').config();

//Configuração do pool de conexões usando variáveis de ambiente
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Se preferires usar parâmetros separados, podes usar:
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    // port: process.env.DB_PORT,
});

pool.on('connect' , () => {
    console.log('Ligação estabelecida com a base de ddos PostgreSQL!');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
