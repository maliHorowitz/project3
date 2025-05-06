// models/user.js
import { con } from '../../DB/connection_DB.js';

export const User = {
    create: (userData, callback) => {
        const sql = `
            INSERT INTO users (name, email, phone)
            VALUES (?, ?, ?)
        `;
        con.query(sql, [userData.name, userData.email, userData.phone], callback);
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM users';
        con.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        con.query(sql, [id], callback);
    }
};