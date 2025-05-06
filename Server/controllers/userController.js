// controllers/userController.js
import { User } from '../models/user.js';

export const createUser = (req, res) => {
    const { username, email, phone } = req.body;
    
    if (!username || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    User.create({ username, email, phone }, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Failed to register user' });
        }
        
        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    });
};

export const getUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.status(200).json(results);
    });
};

export const getUserById = (req, res) => {
    const id = req.params.id;
    User.getById(id, (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result);
    });
};