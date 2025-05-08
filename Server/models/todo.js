import { con } from '../../DB/connection_DB.js';

export const Todo = {
    // Get all todos for a specific user
    getByUserId: async (userId) => {
        console.log(userId);
        const sql = 'SELECT * FROM todos WHERE user_id = ? ORDER BY id';
        const [rows] = await con.promise().execute(sql, [userId]);
        console.log(rows);
        return rows;
    },

    // Get a specific todo by ID
    getById: async (id) => {
        const sql = 'SELECT * FROM todos WHERE id = ?';
        const [rows] = await con.promise().execute(sql, [id]);
        return rows[0];
    },

    // Create a new todo
    create: async (todoData) => {
        const sql = `
            INSERT INTO todos (title, completed, user_id)
            VALUES (?, ?, ?)
        `;
        const [result] = await con.promise().execute(sql, [todoData.title, todoData.completed, todoData.userId]);
        return result;
    },

    // Update an existing todo
    update: async (id, todoData) => {
        const sql = `
            UPDATE todos
            SET title = ?, completed = ?
            WHERE id = ?
        `;
        const [result] = await con.promise().execute(sql, [todoData.title, todoData.completed, id]);
        return result;
    },

    // Delete a todo
    delete: async (id) => {
        const sql = 'DELETE FROM todos WHERE id = ?';
        const [result] = await con.promise().execute(sql, [id]);
        return result;
    }
};