import express from 'express';
import { pool } from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM accommodations WHERE available_units > 0'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  const { name, address, city, price, total_units, available_units } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO accommodations (name, address, city, price, total_units, available_units) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, city, price, total_units, available_units]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM accommodations WHERE accommodation_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, city, price, total_units, available_units } = req.body;
  try {
    const result = await pool.query(
      'UPDATE accommodations SET name=$1, address=$2, city=$3, price=$4, total_units=$5, available_units=$6 WHERE accommodation_id=$7 RETURNING *',
      [name, address, city, price, total_units, available_units, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM accommodations WHERE accommodation_id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;