import express from 'express';
import { createUser, getUserByUsername } from '../controllers/userController.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
const router = express.Router();

router.post('/',validateSignup, createUser);
router.get('/',validateLogin, getUserByUsername);

export default router;