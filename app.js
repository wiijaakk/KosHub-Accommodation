import express from "express";
import accommodationRoutes from './routes/accommodations.js';
import bookingRoutes from './routes/bookings.js';
import authRoutes from './routes/authenticate.js';
import userServices from './services/users.js';
import { authenticateToken } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use('/auth', authRoutes);
app.use(authenticateToken);
app.use('/users', userServices);
app.use('/accommodations', accommodationRoutes);
app.use('/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});