import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'srv1631.hstgr.io',
  user: process.env.DB_USER || 'u295847955_chat',
  password: process.env.DB_PASSWORD || 'P@r97778968',
  database: process.env.DB_NAME || 'u295847955_chat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;