

import express from "express";
import accommodationRoutes from './routes/accommodations.js';

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use('/accommodations', accommodationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});