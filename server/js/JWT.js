import jwt from 'jsonwebtoken';

export const createToken = (data) => {
    return jwt.sign(data, process.env.JWT_TOKEN_SECRET, { expiresIn: '30d' });
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN_SECRET);
}