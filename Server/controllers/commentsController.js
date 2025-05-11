import { Comments } from '../models/comments.js';

export const getComments = async (req, res) => {
    try {
        const postId = req.query.postId;
        console.log(postId, "postId");
        
        const comments = await Comments.getAllComments(postId);
        console.log(comments, "commentsData");
        res.status(200).json(comments);
    
    } catch (err) {
        console.error('Error fetching Comments:', err.message);
        res.status(500).json({ error: 'Failed to fetch Comments' });
    }
};

// Add a new post
export const createComment = async (req, res) => {
    try {
        console.log(req.body, "commentsDataContoroller");
        const { email, body, postId } = req.body;
        // const userId = req.user.id; // Assuming `req.user` contains the active user's info
 
        if (!body) {
            return res.status(400).json({ error: 'Body is required' });
        }
        const result = await Comments.create({ email, body, postId});
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comments not found' });
        }
        req.body.id = result.insertId;
        res.status(201).json(req.body);
    } catch (err) {
        console.error('Error creating Comments:', err.message);
        res.status(500).json({ error: 'Failed to create Comments' });
    }
};

// Update an existing post
export const updateComments = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req.body;

        const result = await Comments.update(id, { body });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comments not found' });
        }

        res.status(200).json(req.body);
    } catch (err) {
        console.error('Error updating Comments:', err.message);
        res.status(500).json({ error: 'Failed to update Comments' });
    }
};

// Delete a post
export const deleteComments = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Comments.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comments not found' });
        }

        res.status(200).json({ message: 'Comments deleted successfully' });
    } catch (err) {
        console.error('Error deleting Comments:', err.message);
        res.status(500).json({ error: 'Failed to delete Comments' });
    }
};