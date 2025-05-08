import express from 'express';
import {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
} from '../controllers/todoController.js';

const router = express.Router();

// Get all todos for the active user
router.get('/', getTodos);

// Get a specific todo by ID
router.get('/:id', getTodoById);

// Add a new todo
router.post('/', createTodo);

// Update an existing todo
router.put('/:id', updateTodo);

// Delete a todo
router.delete('/:id', deleteTodo);

export default router;