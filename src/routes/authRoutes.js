const express = require('express')
const router = express.Router()
const {signup, signin, logout, verifyOtp} = require('../controllers/authController')
const {authenticateToken} = require('../middlewares/authMiddleware')

router.post('/signup', signup)
router.post('/verify-otp', verifyOtp);
router.post('/signin', signin)
router.post('/logout', authenticateToken, logout);
module.exports = router
