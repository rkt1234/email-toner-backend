const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {userEmailHistory, generateEmail, rewriteEmail, saveEmail} = require('../controllers/emailController')
const {emailRateLimiter} = require('../middlewares/rateLimiter')
const router = express.Router()

router.get('/history', authenticateToken, userEmailHistory)
router.post('/generate', emailRateLimiter, authenticateToken, generateEmail)
router.post('/rewrite', emailRateLimiter, authenticateToken, rewriteEmail)
router.post('/save', authenticateToken, saveEmail)

module.exports = router
