import { con } from '../../DB/connection_DB.js';

export const Comments = {
    getAllComments: async (postId) => {
        const sql = 'SELECT * FROM comments where postId=? ORDER BY id';
        const [rows] = await con.promise().execute(sql, [postId]);
        return rows;
    },

    create: async (commentsData) => {
        const sql = `
            INSERT INTO comments ( email, body, postId )
            VALUES (?, ?, ?)
        `;
        const [result] = await con.promise().execute(sql, [commentsData.email, commentsData.body, commentsData.postId]);
   return result;
    },

    // Update an existing post
    update: async (id, commentsData) => {
        const sql = `
            UPDATE comments
            SET body = ?
            WHERE id = ?
        `;
        const [result] = await con.promise().execute(sql, [commentsData.body, id]);
        return result;
    },

    // Delete a post
    delete: async (id) => {
        const sqlComments = 'DELETE FROM comments WHERE id = ?';
        const [result] = await con.promise().execute(sqlComments, [id]);
        return result;
    }
};