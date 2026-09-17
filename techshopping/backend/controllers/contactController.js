// ===== controllers/contactController.js =====
const ContactService = require('../services/contactService');
const { successResponse, errorResponse } = require('../utils/responses');
const { MESSAGES } = require('../constants/messages');

class ContactController {
    // ===== POST /api/contact =====
    static async create(req, res, next) {
        try {
            const { name, email, content } = req.body;
            
            const newContact = await ContactService.createContact({
                name,
                email,
                content
            });
            
            console.log('📧 Message saved:', newContact.id);
            
            return successResponse(res, 201, MESSAGES.CONTACT_CREATED, newContact);
        } catch (error) {
            next(error);
        }
    }

    // ===== GET /api/contact =====
    static async getAll(req, res, next) {
        try {
            const contacts = await ContactService.getAllContacts();
            return successResponse(res, 200, MESSAGES.CONTACTS_FETCHED, {
                count: contacts.length,
                contacts
            });
        } catch (error) {
            next(error);
        }
    }

    // ===== GET /api/contact/:id =====
    static async getById(req, res, next) {
        try {
            const contact = await ContactService.getContactById(req.params.id);
            return successResponse(res, 200, MESSAGES.CONTACT_FETCHED, contact);
        } catch (error) {
            next(error);
        }
    }

    // ===== DELETE /api/contact/:id =====
    static async delete(req, res, next) {
        try {
            await ContactService.deleteContact(req.params.id);
            return successResponse(res, 200, MESSAGES.CONTACT_DELETED);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ContactController;