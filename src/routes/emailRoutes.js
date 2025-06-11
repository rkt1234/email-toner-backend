const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {userEmailHistory} = require('../controllers/emailController')
const router = express.Router()

router.get('/history', authenticateToken, userEmailHistory)
module.exports = router
