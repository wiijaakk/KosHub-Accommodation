import express from 'express';
import { pool } from '../db/pool.js';

const router = express.Router();
console.log(pool);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM accommodations'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;