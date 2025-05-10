import { Post } from '../models/post.js';

export const getPosts = async (req, res) => {
    try {
        console.log('header', req.headers);

        //const userId = req.headers.userid; 
        //console.log('userid', userId);

        const posts = await Post.getAllPosts();
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

// Get a specific post by ID
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getById(id);
        if (!post) {
            return res.status(404).json({ error: 'post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error('Error fetching post:', err.message);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// Add a new post
export const createPost = async (req, res) => {
    try {
        console.log(req.body, "postDataContoroller");
        const { title, body, userId } = req.body;
        // const userId = req.user.id; // Assuming `req.user` contains the active user's info
 
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const result = await Post.create({ title, body, userId });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        req.body.id = result.insertId;
        res.status(201).json(req.body);
    } catch (err) {
        console.error('Error creating post:', err.message);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Update an existing post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;

        const result = await Post.update(id, { title, body });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(req.body);
    } catch (err) {
        console.error('Error updating post:', err.message);
        res.status(500).json({ error: 'Failed to update post' });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Post.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err.message);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};