// routes/userRoutes.js
import express from 'express';
import { createUser, getUserByUsername } from '../controllers/userController.js';
// import { registerUser } from 'E:/year 2 computers b7/full stack/project Mali Bracha/project3/Server/controllers/userController.js';
const router = express.Router();

router.post('/register', createUser);
//router.get('/', getUsers);
//router.get('/:id', getUserById);
router.get('/', getUserByUsername);

export default router;