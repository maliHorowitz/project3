// routes/userRoutes.js
import express from 'express';
import { createUser, getUsers, getUserById } from '../controllers/userController.js';
// import { registerUser } from 'E:/year 2 computers b7/full stack/project Mali Bracha/project3/Server/controllers/userController.js';
const router = express.Router();

router.post('/register', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/login', getUsers);

export default router;