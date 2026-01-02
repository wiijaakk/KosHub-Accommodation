import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        req.user = {
            id: user.id,
            email: user.email,
        };
        next();
    } catch (err) {
        console.error('Auth Error:', err.message);
        return res.status(403).json({ message: 'Invalid token', error: err.message });
    }
}