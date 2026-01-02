import express from 'express';
import { pool } from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.*,
        EXISTS (
          SELECT 1
          FROM bookings b
          WHERE b.user_id = u.user_id
            AND b.status = 'SUCCESS'
            AND CURRENT_DATE BETWEEN b.start_date AND b.end_date
        ) AS is_booking
      FROM users u
    `);
    res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
            [name, email, phone]
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
        `SELECT 
            u.*,
            EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.user_id = u.user_id
                AND b.status = 'SUCCESS'
                AND CURRENT_DATE BETWEEN b.start_date AND b.end_date
            ) AS is_booking
        FROM users u
        WHERE u.user_id=$1
        `, [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {name, email, phone} = req.body;
    try{
        const result = await pool.query(
            'UPDATE users SET name=$1, email=$2, phone=$3 WHERE user_id=$4 RETURNING *',
            [name, email, phone, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
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
            'DELETE FROM users WHERE user_id=$1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

export default router;