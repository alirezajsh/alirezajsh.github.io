// ===== middlewares/errorHandler.js =====
const { errorResponse } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    
    // خطاهای خاص
    if (err.message === 'Contact not found') {
        return errorResponse(res, 404, 'Contact not found');
    }
    
    // خطای پیش‌فرض
    return errorResponse(res, 500, 'Internal server error');
};

module.exports = errorHandler;