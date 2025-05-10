import express from 'express';
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} from '../controllers/postController.js';

const router = express.Router();

// Get all posts
router.get('/', getPosts);

// Get a specific post by ID
router.get('/:id', getPostById);

// Add a new post
router.post('/', createPost);

// Update an existing post
router.put('/:id', updatePost);

// Delete a post
router.delete('/:id', deletePost);

export default router;