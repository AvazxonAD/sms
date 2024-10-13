const { Router } = require('express')
const router = Router()
const upload = require('../utils/protect.file')
const { 
    sendSms,
    importExcelData,
    generateExample
} = require('../controllers/sms.controller')

const protect = require('../middlewares/auth')


router.post('/', protect, sendSms)
router.post('/excel', protect, upload.single('file'), importExcelData)
router.get('/example', protect, generateExample)

module.exports = router