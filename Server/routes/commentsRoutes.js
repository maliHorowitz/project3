import express from 'express';
import {
    getComments,
    createComment,
    updateComments,
    deleteComments
} from '../controllers/commentsController.js';

const router = express.Router();

// Get all comments
router.get('/', getComments);

// Add a new comment
router.post('/', createComment);

// Update an existing comment
router.put('/:id', updateComments);

// Delete a comment
router.delete('/:id', deleteComments);

export default router;