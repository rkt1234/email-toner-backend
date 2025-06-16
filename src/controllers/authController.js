const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { triggerWelcomeEmailJob, sendOtpVerificationEmail, sendPasswordResetOtp } = require('../services/emailService');
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
      if (existingUser.isVerified) {
        return res.status(400).json({ error: 'User already exists and is verified. Please sign in.' });
      } else {
        return res.status(400).json({ error: 'User already exists but is not verified. Please verify your email.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        otpCode: otp,
        otpExpiresAt,
      },
    });

    await sendOtpVerificationEmail({ email, otp });

    res.status(200).json({ message: 'OTP sent to your email. Please verify to continue.' });
    logger.info('OTP sent during signup', { email });

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Signup failed' });
    }
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.isVerified) {
      return res.status(400).json({ error: 'Invalid request or already verified.' });
    }

    if (user.otpCode !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    const token = jwt.sign({ id: updatedUser.id }, JWT_SECRET, { expiresIn: '7d' });

    triggerWelcomeEmailJob({ email: updatedUser.email, name: updatedUser.name });

    return res.status(200).json({ message: 'Email verified successfully.', token });

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isVerified) {
      return res.status(404).json({ error: "User not found or not verified." });
    }

    const resetOtpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.user.update({
      where: { email },
      data: {
        resetOtpCode,
        resetOtpExpiresAt,
      },
    });

    // You can use the existing sendOtpVerificationEmail or a new one like sendPasswordResetOtp
    await sendOtpVerificationEmail({ email, otp: resetOtpCode });

    return res.status(200).json({ message: "Password reset OTP sent to your email." });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetOtpCode || !user.resetOtpExpiresAt) {
      return res.status(400).json({ error: "Invalid request or expired OTP." });
    }

    if (user.resetOtpCode !== otp || new Date() > user.resetOtpExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Optional: you could also set a flag like canReset = true here

    return res.status(200).json({ message: "OTP verified successfully. You may now reset your password." });

  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "OTP verification failed." });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetOtpCode || !user.resetOtpExpiresAt) {
      return res.status(400).json({ error: "OTP not verified or expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtpCode: null,
        resetOtpExpiresAt: null,
      },
    });

    return res.status(200).json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: "Password reset failed." });
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

    // ✅ Enforce email verification
    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Email not verified. Please verify your email before logging in.'
      });
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


exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); // convert to ms

    await prisma.blacklistedToken.create({
      data: {
        token,
        userId: req.user.id,
        expiresAt,
      },
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

