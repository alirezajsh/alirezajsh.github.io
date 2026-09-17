// ===== config/database.js =====
const mysql = require('mysql2/promise');

// ===== ساخت Connection Pool =====
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ===== تست اتصال =====
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL Error:', error.message);
        throw error;
    }
};

// ===== اجرای کوئری =====
const query = async (sql, params = []) => {
    const [results] = await pool.execute(sql, params);
    return results;
};

module.exports = {
    pool,
    query,
    testConnection
};