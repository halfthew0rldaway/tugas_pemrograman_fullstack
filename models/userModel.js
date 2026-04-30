const db = require('../config/db');

const User = {

    // Ambil semua user (untuk chart & export)
    getAll: (callback) => {
        db.query('SELECT id, name, email, phone FROM users', callback);
    },

    // Ambil user dengan pagination + search
    getPaginated: (search, limit, offset, callback) => {
        const like = `%${search}%`;
        const sql = `
            SELECT id, name, email, phone 
            FROM users 
            WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
            LIMIT ? OFFSET ?
        `;
        db.query(sql, [like, like, like, limit, offset], callback);
    },

    // Hitung total user (untuk pagination)
    countAll: (search, callback) => {
        const like = `%${search}%`;
        const sql = `
            SELECT COUNT(*) AS total 
            FROM users 
            WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
        `;
        db.query(sql, [like, like, like], callback);
    },

    getByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },

    create: (data, callback) => {
        const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [data.name, data.email, data.phone, data.password], callback);
    },

    update: (id, data, callback) => {
        const sql = 'UPDATE users SET name=?, email=?, phone=? WHERE id=?';
        db.query(sql, [data.name, data.email, data.phone, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id=?', [id], callback);
    }

};

module.exports = User;
