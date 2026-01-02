import express from 'express';
import { pool } from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
        'SELECT * FROM bookings;'
    ); 
    res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

router.post('/', async (req, res) => {
    const { room_id, user_id, base_price, discount_applied, final_price, start_date, end_date, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bookings (room_id, user_id, base_price, discount_applied, final_price, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [room_id, user_id, base_price, discount_applied, final_price, start_date, end_date, status]
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
        'SELECT * FROM bookings WHERE bookings.id=$1',
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
    const client = await pool.connect();
    const {id} = req.params;
    const { room_id, status } = req.body;
        try {
            await client.query('BEGIN');
            const bookingResult = await client.query(
                'UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',
                [status, id]
            );
            if (bookingResult.rows.length === 0) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            if (status === 'SUCCESS') {
                const roomResult = await client.query(
                    `UPDATE rooms 
                    SET available_units = available_units - 1 
                    WHERE id=$1 AND available_units > 0 
                    RETURNING *`,
                    [room_id]
                );
                if (roomResult.rows.length === 0) {
                    return res.status(404).json({ message: 'No available units' });
                }
            }
            await client.query('COMMIT');
            res.json(bookingResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
    finally {
        client.release();
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
        'DELETE FROM bookings WHERE id=$1 RETURNING *',
        [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

export default router;