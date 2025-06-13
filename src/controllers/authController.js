const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { triggerWelcomeEmailJob } = require('../services/emailService');
const { validateSignup, validateSignin } = require('../services/validationService');
const logger = require('../utils/logger');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.signup = async (req, res) => {
  const validationError = validateSignup(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User created', token });
    logger.info('User signed up', { email });

    triggerWelcomeEmailJob({ email, name });

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Signup failed' });
    }
  }
};

exports.signin = async (req, res) => {
  const validationError = validateSignin(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
