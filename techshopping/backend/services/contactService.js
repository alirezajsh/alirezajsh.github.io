// ===== services/contactService.js =====
const Contact = require('../models/Contact');

class ContactService {
    // ===== ثبت پیام جدید =====
    static async createContact({ name, email, content }) {
        const newContact = await Contact.create({ name, email, content });
        
        // TODO: ارسال ایمیل (بعداً)

        
        return newContact;
    }

    // ===== دریافت همه پیام‌ها =====
    static async getAllContacts() {
        return await Contact.findAll();
    }

    // ===== دریافت یه پیام =====
    static async getContactById(id) {
        const contact = await Contact.findById(id);
        if (!contact) {
            throw new Error('Contact not found');
        }
        return contact;
    }

    // ===== حذف پیام =====
    static async deleteContact(id) {
        const deleted = await Contact.delete(id);
        if (!deleted) {
            throw new Error('Contact not found');
        }
        return true;
    }
}

module.exports = ContactService;