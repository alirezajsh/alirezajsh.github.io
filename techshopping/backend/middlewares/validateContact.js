// ===== middlewares/validateContact.js =====
const { isValidEmail } = require('../utils/validators');
const { errorResponse } = require('../utils/responses');

const validateContact = (req, res, next) => {
    const { name, email, content } = req.body;
    
    // بررسی وجود فیلدها
    if (!name || !email || !content) {
        return errorResponse(res, 400, 'Please fill in all fields');
    }
    
    // بررسی طول
    if (name.length < 2 || name.length > 100) {
        return errorResponse(res, 400, 'Name must be between 2 and 100 characters');
    }
    
    // بررسی ایمیل
    if (!isValidEmail(email)) {
        return errorResponse(res, 400, 'Please enter a valid email address');
    }
    
    // بررسی متن
    if (content.length < 5 || content.length > 1000) {
        return errorResponse(res, 400, 'Message must be between 5 and 1000 characters');
    }
    
    next();
};

module.exports = validateContact;