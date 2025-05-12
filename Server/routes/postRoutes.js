import express from 'express';
import {
    getPosts,
    createPost,
    updatePost,
    deletePost
} from '../controllers/postController.js';

const router = express.Router();

// Get all posts
router.get('/', getPosts);

// Add a new post
router.post('/', createPost);

// Update an existing post
router.put('/:id', updatePost);

// Delete a post
router.delete('/:id', deletePost);

export default router;