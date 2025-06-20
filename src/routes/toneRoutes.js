const express = require('express')
const {authenticateToken} = require('../middlewares/authMiddleware')
const {getEmailMetadata, suggestTone} = require('../controllers/toneController')
const router = express.Router()

router.get('/all', authenticateToken, getEmailMetadata)
router.post('/suggest', authenticateToken, suggestTone)


module.exports = router
