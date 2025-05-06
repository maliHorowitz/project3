// routes/userRoutes.js
import express from 'express';
import { createUser, getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/login', getUsers);

export default router;