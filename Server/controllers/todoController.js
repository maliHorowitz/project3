import { Todo } from '../models/todo.js';

// Get all todos for the active user
export const getTodos = async (req, res) => {
    try {
        console.log('req', req);

        const userId = req.headers.userid; // Assuming `req.user` contains the active user's info
        console.log('userid', userId);

        const todos = await Todo.getByUserId(userId);
        res.status(200).json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err.message);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

// Get a specific todo by ID
export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.getById(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (err) {
        console.error('Error fetching todo:', err.message);
        res.status(500).json({ error: 'Failed to fetch todo' });
    }
};

// Add a new todo
export const createTodo = async (req, res) => {
    try {
        const {  title, completed,userId } = req.body;
        // const userId = req.user.id; // Assuming `req.user` contains the active user's info

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await Todo.create({ title, completed: completed || false, userId });
        res.status(201).json({ message: 'Todo created successfully', todoId: result.insertId });
    } catch (err) {
        console.error('Error creating todo:', err.message);
        res.status(500).json({ error: 'Failed to create todo' });
    }
};

// Update an existing todo
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const result = await Todo.update(id, { title, completed });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (err) {
        console.error('Error updating todo:', err.message);
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Todo.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error('Error deleting todo:', err.message);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};