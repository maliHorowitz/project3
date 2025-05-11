import { con } from '../../DB/connection_DB.js';

export const Post = {
    // Get all posts for a specific user
    getAllPosts: async () => {
        //console.log(userId);
        const sql = 'SELECT * FROM posts ORDER BY id';
        const [rows] = await con.promise().execute(sql, []);
        console.log(rows,"postsModel");
        return rows;
    },

    // Get a specific post by ID
    getById: async (id) => {
        const sql = 'SELECT * FROM posts WHERE id = ?';
        const [rows] = await con.promise().execute(sql, [id]);
        return rows[0];
    },

    // Create a new post
    create: async (postData) => {
        console.log(postData, "postDataModel");
        const sql = `
            INSERT INTO posts (title, body, userId)
            VALUES (?, ?, ?)
        `;
        const [result] = await con.promise().execute(sql, [postData.title, postData.body, postData.userId]);
   return result;
    },

    // Update an existing post
    update: async (id, PostData) => {
        const sql = `
            UPDATE posts
            SET title = ?, body = ?
            WHERE id = ?
        `;
        const [result] = await con.promise().execute(sql, [PostData.title, PostData.body, id]);
        return result;
    },

    // Delete a post
    delete: async (id) => {
         const sqlComments='DELETE FROM comments WHERE postId = ?';
         const [resultComments] = await con.promise().execute(sqlComments, [id]);

        const sqlPost = 'DELETE FROM posts WHERE id = ?';
        const [result] = await con.promise().execute(sqlPost, [id]);
        return result;
    }
};