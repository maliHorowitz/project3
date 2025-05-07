// // models/user.js
// import { con } from '../../DB/connection_DB.js';

// export const User = {
//     create: (userData, callback) => {
//         const sql = `
//             INSERT INTO users (name, email, phone)
//             VALUES (?, ?, ?)
//         `;
//         con.query(sql, [userData.name, userData.email, userData.phone], callback);
//     },

//     getAll: (callback) => {
//         const sql = 'SELECT * FROM users';
//         con.query(sql, callback);
//     },

//     getById: (id, callback) => {
//         const sql = 'SELECT * FROM users WHERE id = ?';
//         con.query(sql, [id], callback);
//     }
// };
import { con } from '../../DB/connection_DB.js';
// export const User = {
//     create: async (userData) => {
//         const sql = `
//             INSERT INTO users (username, email, phone)
//             VALUES (?, ?, ?)
//         `;
//         const [result] = await con.promise().execute(sql, [userData.username, userData.email, userData.phone]);

//         return result;
//     },
export const User = {
    create: async (userData, hashedPassword) => {

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
            const [result] =await con.promise().execute(sqlPassword, [userId, hashedPassword]);

            return result;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },




    // getByUsername: async (username) => {
    //     console.log('username', username);
    //     const sql = 'SELECT * FROM users WHERE username = ?';
    //     const [rows] = await con.promise().execute(sql, [username]);
    //     return rows;
    // }
    getByUsername: async (username) => {
        console.log('username', username);
        const sql = 'SELECT u.username, p.password FROM users u JOIN passwords p ON u.id = p.id WHERE u.username = ?;';
        const [rows] = await con.promise().execute(sql, [username]);
        return rows;
    }
};