import { con } from '../../DB/connection_DB.js';

export const User = {
    create: async (userData) => {
        console.log(userData, "userData");
        console.log(userData.encryptedPassword, "hashedPassword");
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
            console.log(userResult, "userResult");
            const userId = userResult.insertId;

            const sqlPassword = `
                INSERT INTO passwords (id, password)
                VALUES (?, ?)
            `;
            //userData.insertId=userId;
            const result = await con.promise().execute(sqlPassword, [userId, userData.encryptedPassword]);
            console.log(result, "p_result");
            result[0].userId = userId;
            console.log(result, "resultWithId");
            
            return result
            // if (result[0].affectedRows > 0) {
            //     //userData.insertId=result[0].insertId
            //     console.log(userData, "userDataWithId");
            //     return userData;
            // }
            // else {
            //     console.log("result.affectedRows", result.affectedRows);
            //     throw "Failed to register user";
            // }
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    getByUsername: async (username) => {
        console.log('username', username);
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