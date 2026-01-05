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
    documentation: 'See README.md for complete API documentation',
    endpoints: [
      // Authentication
      { method: 'POST', path: '/auth/login', description: 'Login with email & password' },
      { method: 'POST', path: '/auth/register', description: 'Register new user' },
      { method: 'PUT', path: '/auth/change-password', description: 'Change password' },
      { method: 'GET', path: '/users', description: 'Get current user profile' },
      { method: 'GET', path: '/users/:id', description: 'Get user profile by id' },
      { method: 'PUT', path: '/users/:id', description: 'Update user profile & membership' },
      { method: 'DELETE', path: '/users/:id', description: 'Delete user account' },
      { method: 'GET', path: '/accommodations', description: 'List all available accommodations' },
      { method: 'POST', path: '/accommodations', description: 'Add new accommodation' },
      { method: 'GET', path: '/accommodations/:id', description: 'Get accommodation details' },
      { method: 'PUT', path: '/accommodations/:id', description: 'Update accommodation' },
      { method: 'DELETE', path: '/accommodations/:id', description: 'Delete accommodation' },
      { method: 'GET', path: '/bookings', description: 'List all bookings' },
      { method: 'POST', path: '/bookings', description: 'Create new booking' },
      { method: 'GET', path: '/bookings/:id', description: 'Get bookings by user id' },
      { method: 'PUT', path: '/bookings/:id', description: 'Update booking status' },
      { method: 'DELETE', path: '/bookings/:id', description: 'Delete booking' }
    ],
    note: 'All /users, /accommodations, /bookings endpoints require authentication token. See README.md for details.'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});