const { Router } = require('express')
const router = Router()

const { 
    login,
    getProfile,
    update,
    getBalance,
    getSmsText
} = require('../controllers/auth.controller')

const protect = require('../middlewares/auth')


router.post('/login', login)
    .get('/sms-string', protect, getSmsText)
    .get('/balance', protect, getBalance)
    .get('/', protect, getProfile)
    .put('/', protect, update)

module.exports = router