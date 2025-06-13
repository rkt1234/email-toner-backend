const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const isBlacklisted = await prisma.blacklistedToken.findUnique({
      where: { token },
    });

    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token is blacklisted. Please login again.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

