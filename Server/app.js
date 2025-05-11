import pkg from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';

dotenv.config({ path: '../.env' });
dotenv.config();

const express = pkg;
const app = express();
app.use(express.json());
app.use(cors());

// Use the user routes
app.use('/api/users', userRoutes);
// Use the todo routes
app.use('/api/todos', todoRoutes);
// Use the post routes
app.use('/api/posts', postRoutes);
// Use the comment routes
app.use('/api/comments', commentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});