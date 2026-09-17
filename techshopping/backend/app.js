// ===== app.js =====
const express = require('express');
const corsMiddleware = require('./middlewares/corsMiddleware');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ===== Middlewares =====
app.use(corsMiddleware);
app.use(express.json());

// ===== Routes =====
app.use('/api/contact', contactRoutes);

// ===== Health Check =====
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: '🚀 Server is working!' 
    });
});

// ===== Error Handler (باید آخرین middleware باشه) =====
app.use(errorHandler);

module.exports = app;