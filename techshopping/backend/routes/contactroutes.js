// ===== routes/contactRoutes.js =====
const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const validateContact = require('../middlewares/validateContact');

// ===== Routes =====
router.post('/', validateContact, ContactController.create);
router.get('/', ContactController.getAll);
router.get('/:id', ContactController.getById);
router.delete('/:id', ContactController.delete);

module.exports = router;