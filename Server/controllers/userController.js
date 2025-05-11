
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}


async function comparePasswords(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(isMatch, "isMatch");
    return isMatch;
}

export const createUser = async (req, res) => {
    // const { username, email, phone, password } = req.body;
    // console.log(req.body, "body");
    // if (!username || !email || !phone) {
    //     return res.status(400).json({ error: 'All fields are required' });
    // }
    try {
        let encryptedPassword = await hashPassword(password);
        console.log(encryptedPassword, "encryptedPassword");
        const result = await User.create({ username, email, phone, encryptedPassword });
        console.log(result, "reaultSignup");
        if (result[0].affectedRows > 0) {
            
            //req.body.insertId = result.insertId
            res.status(201).json({
                message: 'User registered successfully',
                username: username, // Use `id` from the result
                id: result[0].userId,
                email: email
            });
        }
        // res.status(201).json({
        //     message: 'User registered successfully',
        //     username: result.username, // Use `id` from the result
        //     id: result.insertId
        // });
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
};





export const getUserByUsernameAndPassword = async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    console.log(username, password, "username, password");
    try {
        const result = await User.getByUsername(username);
        console.log(result, "resultLogin");
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

    if (req.query.password) {
        console.log("password", req.query.password);
        return getUserByUsernameAndPassword(req, res);
    }
    else {
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

