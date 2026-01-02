import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401).json({ message: 'No authorization header' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401).json({ message: 'No token provided' });
    try{
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
        };
        next();
    } 
    catch(err){
        return res.status(403).json({ message: 'Invalid token' });
    }
}