import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt-helpers.js';

function authTocken(req, res, next) {
    const token = req.headers['authorization']; // TOKEN
    if (token == null) {
        return res.status(401).json({error: 'Access denied. Null token.'});
    }

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(401).json({error: 'TokenExpiredError'});
                    return;
                }
                return res.status(403).json({error: 'Invalid token.'});
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(400).json({error: 'Invalid token'});
    }
}

export {authTocken};