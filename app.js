import express from "express";
import accommodationRoutes from './routes/accommodations.js';
import bookingRoutes from './routes/bookings.js';
import authRoutes from './routes/authenticate.js';
import userServices from './services/users.js';
import { authenticateToken } from "./middleware/auth.js";
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
const port = process.env.PORT;
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', authenticateToken, userServices);
app.use('/accommodations', authenticateToken, accommodationRoutes);
app.use('/bookings', authenticateToken, bookingRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KosHub Accommodation API',
    version: '1.0.0',
    services: ['accommodation', 'bookings', 'users'],
    endpoints: {
      accommodations: 'GET /accommodations',
      bookings: 'GET /bookings',
      users: 'GET /users'
    },
    documentation: 'See README.md for complete API documentation',
    note: 'All /api/* endpoints require authentication token and active booking (if applicable)'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});