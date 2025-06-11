const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {userEmailHistory, generateEmail, rewriteEmail} = require('../controllers/emailController')
const router = express.Router()

router.get('/history', authenticateToken, userEmailHistory)
router.post('/generate', authenticateToken, generateEmail)
router.post('/rewrite', authenticateToken, rewriteEmail)
module.exports = router
