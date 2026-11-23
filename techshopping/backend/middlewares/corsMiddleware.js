// ===== middlewares/corsMiddleware.js =====
const cors = require('cors');

const corsOptions = {
    origin: '*', // فقط برای توسعه
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);