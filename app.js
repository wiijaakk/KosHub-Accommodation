import express from "express";
import accommodationRoutes from './routes/accommodations.js';
import bookingRoutes from './routes/bookings.js';
import userServices from './services/users.js';

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use('/accommodations', accommodationRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userServices);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});