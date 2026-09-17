// ===== models/Contact.js =====
const { query } = require('../config/database');

class Contact {
    // ===== ذخیره پیام جدید =====
    static async create({ name, email, content }) {
        const sql = `
            INSERT INTO contacts (name, email, content)
            VALUES (?, ?, ?)
        `;
        const result = await query(sql, [name, email, content]);
        return {
            id: result.insertId,
            name,
            email,
            content
        };
    }

    // ===== دریافت همه پیام‌ها =====
    static async findAll() {
        const sql = `
            SELECT id, name, email, content, time_stamp, created_at
            FROM contacts
            ORDER BY created_at DESC
        `;
        return await query(sql);
    }

    // ===== دریافت پیام با ID =====
    static async findById(id) {
        const sql = `SELECT * FROM contacts WHERE id = ?`;
        const results = await query(sql, [id]);
        return results[0] || null;
    }

    // ===== حذف پیام =====
    static async delete(id) {
        const sql = `DELETE FROM contacts WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Contact;