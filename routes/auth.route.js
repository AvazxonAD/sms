const { Router } = require('express')
const router = Router()

const { 
    login,
    getProfile,
    update,
    getBalanc
} = require('../controllers/auth.controller')

const protect = require('../middlewares/auth')


router.post('/login', login)
router.get('/get', protect, getProfile)
router.put('/update', protect, update)
router.get('/get/balance', protect, getBalanc)

module.exports = router