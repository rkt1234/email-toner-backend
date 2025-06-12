const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bree = require('../utils/bree');
const path = require('path');


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // store securely in .env

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
  
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
  
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
      // ✅ Send response right away — do not wait for email
      res.status(201).json({ message: 'User created', token });
  
      // 🧵 Run email job in the background (fire and forget)
      const jobName = `send-welcome-email-${Date.now()}`;
      bree.add({
        name: jobName,
        path: path.join(__dirname, '../jobs/send-welcome-email.js'),
        worker: {
          workerData: { email, name },
        },
      }).then(() => {
        bree.start(jobName).catch((err) => {
          console.error(`Failed to start job ${jobName}:`, err);
        });
      }).catch((err) => {
        console.error(`Failed to add job ${jobName}:`, err);
      });
  
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Signup failed' });
      }
    }
  };
  


exports.signin = async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

