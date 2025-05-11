import { con } from '../../DB/connection_DB.js';

export const Comments = {
    // Get all posts for a specific user
    getAllComments: async (postId) => {
        //console.log(userId);
        
        const sql = 'SELECT * FROM comments where postId=? ORDER BY id';
        const [rows] = await con.promise().execute(sql, [postId]);
        console.log(rows,"commentsModel");
        return rows;
    },

    // Create a new comment
    create: async (commentsData) => {
        console.log(commentsData, "commentsDataModel");
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
            SET title = ?, body = ?
            WHERE id = ?
        `;
        const [result] = await con.promise().execute(sql, [commentsData.title, commentsData.body, id]);
        return result;
    },

    // Delete a post
    delete: async (id) => {
        // const sqlComments='DELETE FROM comments WHERE post_id = ?';
        // const [resultComments] = await con.promise().execute(sqlComments, [post_id]);

        const sqlComments = 'DELETE FROM comments WHERE id = ?';
        const [result] = await con.promise().execute(sqlComments, [id]);
        return result;
    }
};