const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {userEmailHistory, generateEmail} = require('../controllers/emailController')
const router = express.Router()

router.get('/history', authenticateToken, userEmailHistory)
router.post('/generate', authenticateToken, generateEmail)
module.exports = router
