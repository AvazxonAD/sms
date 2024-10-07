const { Router } = require('express')
const router = Router()
const upload = require('../utils/protect.file')
const { 
    sendSms,
    importExcelData
} = require('../controllers/sms.controller')

const protect = require('../middlewares/auth')


router.post('/send', protect, sendSms)
router.post('/import/from/excel', protect, upload.single('file'), importExcelData)

module.exports = router