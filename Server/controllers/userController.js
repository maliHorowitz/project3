
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}


async function comparePasswords(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

export const createUser = async (req, res) => {
    
    try {
        const { username, email, phone, password } = req.body;
        let encryptedPassword = await hashPassword(password);
        const result = await User.create({ username, email, phone, encryptedPassword });
        if (result[0].affectedRows > 0) {
            
            res.status(201).json({
                message: 'User registered successfully',
                username: username, // Use `id` from the result
                id: result[0].userId,
                email: email
            });
        }
   
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export const getUserByUsernameAndPassword = async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    try {
        const result = await User.getByUsername(username);
        if (result.length) {
            if (await comparePasswords(password, result[0].password)) {
                res.status(200).json([{
                    username: result[0].username,
                    id: result[0].id,
                    email: result[0].email, // Use `id` from the result
                },
                {
                    message: 'User login successfully'
                }]);
            }
            else {
                res.status(40).json({ error: 'Invalid username or password' });
            }
        }
        else {
            res.status(404).json({ error: 'user not found' });

        }
    } catch (err) {
        console.error('Error logging in user:', err.message);
        res.status(500).json({ error: 'Failed to login user' });
    }
};

const getUserByName = async (req, res) => {
    const username = req.query.username;
    try {
        const result = await User.getDataByUsername(username);
        if (!result.length) {
            return res.status(200).json([]); // return an empty array
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Error logging in user:', err.message);
        res.status(500).json({ error: 'Failed to login user' });
    }
}

export const getUserByUsername = async (req, res) => {


    if (req.query.password) {
        return getUserByUsernameAndPassword(req, res);
    }
    else {
        return getUserByName(req, res);
    }
};