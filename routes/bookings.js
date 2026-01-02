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
    const user_id = req.user.id;
    const { accommodation_id, start_date, end_date } = req.body;
    
    try {
        const activeBooking = await pool.query(
            `SELECT 1 FROM bookings 
             WHERE user_id = $1 
               AND status = 'SUCCESS' 
               AND CURRENT_DATE BETWEEN start_date AND end_date`,
            [user_id]
        );
        
        if (activeBooking.rows.length > 0) {
            return res.status(400).json({ message: 'You already have an active booking' });
        }

        const accResult = await pool.query('SELECT price FROM accommodations WHERE accommodation_id = $1', [accommodation_id]);
        if (accResult.rows.length === 0) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }
        
        const userResult = await pool.query('SELECT discount_rate FROM users WHERE id = $1', [user_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const base_price = accResult.rows[0].price;
        const discount_rate = userResult.rows[0].discount_rate || 0;
        const discount_applied = base_price * discount_rate;
        const final_price = base_price - discount_applied;

        const result = await pool.query(
            'INSERT INTO bookings (accommodation_id, user_id, base_price, discount_applied, final_price, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [accommodation_id, user_id, base_price, discount_applied, final_price, start_date, end_date, 'PENDING']
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
        'SELECT * FROM bookings WHERE bookings.booking_id=$1',
        [id]
        );
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Booking Data not found' });
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
    const { accommodation_id, status } = req.body;
        try {
            await client.query('BEGIN');
            const bookingResult = await client.query(
                'UPDATE bookings SET status=$1 WHERE booking_id=$2 RETURNING *',
                [status, id]
            );
            if (bookingResult.rows.length === 0) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            if (status === 'SUCCESS') {
                const accResult = await client.query(
                    `UPDATE accommodations 
                    SET available_units = available_units - 1 
                    WHERE accommodation_id=$1 AND available_units > 0 
                    RETURNING *`,
                    [accommodation_id]
                );
                if (accResult.rows.length === 0) {
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
        'DELETE FROM bookings WHERE booking_id=$1 RETURNING *',
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