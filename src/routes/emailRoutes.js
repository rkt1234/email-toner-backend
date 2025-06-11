const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {userEmailHistory, generateEmail, rewriteEmail, saveEmail} = require('../controllers/emailController')
const router = express.Router()

router.get('/history', authenticateToken, userEmailHistory)
router.post('/generate', authenticateToken, generateEmail)
router.post('/rewrite', authenticateToken, rewriteEmail)
router.post('/save', authenticateToken, saveEmail)

module.exports = router
