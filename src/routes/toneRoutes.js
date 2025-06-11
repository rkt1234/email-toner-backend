const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {allTones, suggestTone} = require('../controllers/toneController')
const router = express.Router()

router.get('/all', authenticateToken, allTones)
router.post('/suggest', authenticateToken, suggestTone)


module.exports = router
