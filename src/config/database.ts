import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'africar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

export default pool;
