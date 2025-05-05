import pkg from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config();

const express=pkg;
const app = express();
app.use(express.json());

// POST route
app.post('/register', (req, res) => {
  const { name, email } = req.body;

  // Simulate processing the data (e.g., saving to a database)
  console.log(`Received data: Name = ${name}, Email = ${email}`);
 
  // Respond to the client
  res.status(200).json({ message: 'Data received successfully', receivedData: { name, email } });
});



const PORT= process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})


