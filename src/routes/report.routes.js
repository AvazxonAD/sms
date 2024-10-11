const { Router } = require('express')
const multer = require('multer')
const router = Router()
const { 
    getAllDates,
    getAllSmses,
    deleteReport,
    getElementById,
    getByPhone,
    getUserInfo
} = require('../controllers/report.controller')

const protect = require('../middlewares/auth')


router.get('/dates', protect, getAllDates)
router.get('/phone', protect, getByPhone)
router.get('/info', protect, getUserInfo)
router.get('/:id', protect, getElementById)
router.get('/', protect, getAllSmses) 
router.delete('/:id', protect, deleteReport)

module.exports = router