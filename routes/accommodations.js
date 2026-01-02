import express from 'express';
import { pool } from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM accommodations JOIN rooms ON accommodations.id = rooms.accommodation_id WHERE rooms.available_units>0'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  const { name, address, city } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO accommodations (name, address, city) VALUES ($1, $2, $3) RETURNING *',
      [name, address, city]
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
      'SELECT * FROM accommodations JOIN rooms ON accommodations.id = rooms.accommodation_id WHERE accommodations.id=$1',
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
  const {id} = req.params;
  const {name, address, city} = req.body;
  try{
    const result = await pool.query(
      'UPDATE accommodations SET name=$1, address=$2, city=$3 WHERE id=$4 RETURNING *',
      [name, address, city, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json(result.rows[0]);
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try{
    const result = await pool.query(
      'DELETE FROM accommodations WHERE id=$1 RETURNING *',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }
    res.json({ message: 'Accommodation deleted successfully' });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

router.post('/:id/rooms/', async (req, res) => {
  const { id } = req.params;
  const { price, total_units, available_units } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO rooms (accommodation_id, price, total_units, available_units) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, price, total_units, available_units]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

export default router;