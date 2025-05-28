require('dotenv').config();
const mysql = require('mysql2/promise');

// Création d'un pool de connexions avec la version promise de mysql2
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eternal_night',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Vérifier la connexion
pool.getConnection()
  .then(connection => {
    console.log('✅ Connecté à MySQL');
    connection.release(); // Libérer la connexion
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MySQL:', err);
  });

module.exports = pool;