const express = require('express')
const router = express.Router()
const {signup, signin, logout, verifyOtp, requestPasswordReset, verifyResetOtp, resetPassword} = require('../controllers/authController')
const {authenticateToken} = require('../middlewares/authMiddleware')

router.post('/signup', signup)
router.post('/verify-otp', verifyOtp);
router.post('/signin', signin)
router.post('/logout', authenticateToken, logout);
router.post('/forgot-password', requestPasswordReset);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
module.exports = router
