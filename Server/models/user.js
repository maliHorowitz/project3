import { con } from '../../DB/connection_DB.js';

export const User = {
    create: async (userData) => {
        try {
            const sqlUser = `
                INSERT INTO users (username, email, phone)
                VALUES (?, ?, ?)
            `;
            const [userResult] = await con.promise().execute(sqlUser, [
                userData.username,
                userData.email,
                userData.phone
            ]);
            const userId = userResult.insertId;

            const sqlPassword = `
                INSERT INTO passwords (id, password)
                VALUES (?, ?)
            `;
            const result = await con.promise().execute(sqlPassword, [userId, userData.encryptedPassword]);
            result[0].userId = userId;
            
            return result
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    getByUsername: async (username) => {
        const sql = 'SELECT u.username, p.password, u.id, u.email FROM users u JOIN passwords p ON u.id = p.id WHERE u.username = ?;';
        const [rows] = await con.promise().execute(sql, [username]);
        return rows;
    },

    getDataByUsername: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ?;';
        const [rows] = await con.promise().execute(sql, [username]);
        return rows;
    }
};