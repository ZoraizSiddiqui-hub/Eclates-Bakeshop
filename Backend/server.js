import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodrouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import 'dotenv/config';

// App configuration
const app = express()
const port = 4000

// Middleware
app.use(express.json());
app.use(cors());


// Db connection
connectDB();

// Api endpoints
app.use('/api/food', foodrouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);

// Routes   
app.get("/", (req, res) => {
    res.send('Hello from the backend server!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
