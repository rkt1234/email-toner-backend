const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // store securely in .env

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
  
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.status(201).json({ message: 'User created', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error during signup' });
    }
  };
  