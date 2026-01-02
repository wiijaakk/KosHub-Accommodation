import express from 'express';
import { pool } from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const id = req.user.id;
    try {
        const result = await pool.query(`SELECT * FROM users u WHERE u.id=$1`, [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

router.put('/', async (req, res) => {
    const id = req.user.id;
    const {name, membership_level} = req.body;
    
    const discountRates = {
        'BASIC': 0.0,
        'SILVER': 0.05,
        'GOLD': 0.10
    };
    const discountRate = discountRates[membership_level] || 0.0;

    try{
        const result = await pool.query(
            'UPDATE users SET name=$1, membership_level=$2, discount_rate=$3 WHERE id=$4 RETURNING *',
            [name, membership_level, discountRate, id]
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

router.delete('/', async (req, res) => {
    const id = req.user.id;
    try{
        const result = await pool.query(
            'DELETE FROM users WHERE id=$1 RETURNING *',
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