import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {id: decoded.id};

            return next();
        } catch (error) {
            console.error('Token Verification failed: ', error);
            return res.status(401).json({error: 'Invalid or expired token'});
        }
    }

    return res.status(401).json({error: 'No token provided'});
}