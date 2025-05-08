// import pkg from 'express';
// import dotenv from 'dotenv';
// import { con } from '../DB/connection_DB.js'; // Adjust the path as needed

// dotenv.config({ path: '../.env' });
// dotenv.config();

// const express=pkg;
// const app = express();
// app.use(express.json());

// // POST route
// app.post('/register', (req, res) => {
//   const { name, password, email, phone } = req.body;
  
//   if (!name || !password || !email || !phone) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const sql = `
//     INSERT INTO users (name, email, phone)
//     VALUES ( ?, ?, ?)
//   `;

//   con.query(sql, [name, password, email, phone], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       return res.status(500).json({ error: 'Failed to register user' });
//     }
    
//     res.status(201).json({
//       message: 'User registered successfully',
//       userId: result.insertId
//     });
//   });
//   // // Simulate processing the data (e.g., saving to a database)
//   // console.log(`Received data: Name = ${name}, Email = ${email}`);
 
//   // // Respond to the client
//   // res.status(200).json({ message: 'Data received successfully', receivedData: { name, email } });
// });



// const PORT= process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// })

// app.js
import pkg from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});