// // controllers/userController.js
// import { User } from '../models/user.js';

// export const createUser = (req, res) => {
//     const { name, email, phone } = req.body;
    
//     if (!name || !email || !phone) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     User.create({ name, email, phone }, (err, result) => {
//         if (err) {
//             console.error('Error inserting user:', err);
//             return res.status(500).json({ error: 'Failed to register user' });
//         }
        
//         res.status(201).json({
//             message: 'User registered successfully',
//             userId: result.insertId
//         });
//     });
// };


// export const getUserById = (req, res) => {
//     const id = req.params.id;
//     User.getById(id, (err, result) => {
//         if (err) {
//             console.error('Error fetching user:', err);
//             return res.status(500).json({ error: 'Failed to fetch user' });
//         }
//         if (!result) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.status(200).json(result);
//     });
// };
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
    const { username, email, phone, password } = req.body;
console.log(req.body, "body");
    if (!username || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        let encryptedPassword = await hashPassword(password);
        console.log(encryptedPassword, "encryptedPassword");
        const result = await User.create({ username, email, phone, encryptedPassword});
        console.log(result , "reault");
        res.status(201).json({
            message: 'User registered successfully',
            username: result.username, // Use `id` from the result
            id: result.insertId
        });
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
};


// export const getUserByUsername = async(req, res) => {
//     const username = req.query.username;
//     try {
//         const result = await User.getByUsername(username);
//         res.status(201).json({
//             message: 'User login successfully',
//             userId: result.insertId, // Use `insertId` from the result
//         });
//     } catch (err) {
//         console.error('Error creating user:', err.message);
//         res.status(500).json({ error: 'Failed to register user' });
//     }
// };

// const getUserByUsernameAndPassword= async (username, password) => {
//     try {
//         const result = await User.getByUsername(username);
//         if (result && await comparePasswords(password, result.password)) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (err) {
//         console.error('Error logging in user:', err.message);
//         return false;
//     }
// };
export const getUserByUsernameAndPassword = async (req, res) => {
     const username = req.query.username;
     const password = req.query.password;

    try {
        const result = await User.getByUsername(username);
        if (result.length && await comparePasswords(password, result.password)) {
            res.status(200).json({
                message: 'User login successfully',
                username: result.username, 
                id: result.insertId // Use `id` from the result
            });
        } else {
            return result;
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
        console.log(result);
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
    // const username = req.query.username;
    // const password = req.query.password;
    if(req.query.password){ 
        return getUserByUsernameAndPassword(req, res);
    }
    else{
    return getUserByName(req, res);
    }
    // try {
    //     const result = await User.getByUsername(username);
    //     if (result && await comparePasswords(password, result.password)) {
    //         res.status(201).json({
    //             message: 'User login successfully',
    //             userId: result.id, // Use `id` from the result
    //         });
    //     } else {
    //         res.status(401).json({ error: 'Invalid username or password' });
    //     }
    // } catch (err) {
    //     console.error('Error logging in user:', err.message);
    //     res.status(500).json({ error: 'Failed to login user' });
    // }
};


// export const getUsers = (req, res) => {
//     User.getAll((err, results) => {
//         if (err) {
//             console.error('Error fetching users:', err);
//             return res.status(500).json({ error: 'Failed to fetch users' });
//         }
//         res.status(200).json(results);
//     });
// };

