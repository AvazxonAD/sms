const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const axios = require('axios')
const returnSumma = require('../utils/returnSumma')
const uuid = require('uuid')
const generateTransmitAccessToken = require('../utils/access');
const xlsx = require('xlsx');
const { getBalanceService, getSmsTextService } = require('../service/users.service')
const smsString = require('../utils/smsString');
const { createReport } = require("../service/report.service");
const costSms = require('../utils/cost.sms')
const { smsValidation } = require('../utils/validation/sms.validation')
const { validationResponse } = require('../utils/validation.response');
const { errorCatch } = require("../utils/errorCtach");
const { resFunc } = require("../utils/resFunc");
const { updateBalance } = require('../service/balance.service')

// to send sms 
const sendSms = asyncHandler(async (req, res, next) => {
    try {
        const user_id = req.user.id
        const body = validationResponse(smsValidation, req.body)
        const text = await getSmsTextService(user_id)
        const balance = await getBalanceService(user_id)

        let testMoney = 0
        for (let client of body.data) {
            const resultString = smsString(text.sms_string, client)
            const cost_sms = costSms(resultString.length)
            testMoney += cost_sms
        }
        if (testMoney > balance.balance) {
            return next(new ErrorResponse(`Sizning balansinggizda mablag' yertarli emas. Balanse : ${returnSumma(balance.balance)} so'm. Kerakli mablag' : ${returnSumma(testMoney - balance.balance)} so'm`))
        }


        const responseData = []
        let summa = 0
        const username = process.env.SECRET_USERNAME
        for (let client of body.data) {
            const utime = Math.floor(Date.now() / 1000);
            const accessToken = generateTransmitAccessToken(username, process.env.SECRET_KEY, utime)
            const resultString = smsString(text.sms_string, client)
            const cost_sms = costSms(resultString.length)

            const data = {
                utime,
                username: username,
                service: {
                    service: 1
                },
                message: {
                    smsid: uuid.v4(),
                    phone: `${client.phone}`,
                    text: resultString
                }
            };
            const response = await axios.post('https://routee.sayqal.uz/sms/TransmitSMS', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': accessToken
                }
            })

            if (response.status === 200) {
                responseData.push({
                    fio: client.fio,
                    phone: client.phone,
                    success: true
                })
                await createReport(client, resultString, req.user.id)
                summa += cost_sms
            }

            if (response.status !== 200) {
                responseData.push({
                    fio: client.fio,
                    phone: client.phone,
                    success: false
                })
            }
        }
        const resultSumma = balance.balance - summa
        await updateBalance(resultSumma, user_id)
        resFunc(res, 200, responseData)
    } catch (error) {
        errorCatch(error, res)
    }
});

// import excel data 
const importExcelData = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse("Fayl yuklanmadi", 400));
    }

    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet, { defval: null }).map(row => {
        const newRow = {};
        for (const key in row) {
            newRow[key.trim()] = row[key];
        }
        return newRow;
    });

    console.log(data)
    for (let test of data) {
        isNotNull(test.fio, test.phone, test.summa);
        isValidPhoneNumber(test.phone);
    }

    return res.status(200).json({
        success: true,
        data: data
    })
})

module.exports = {
    sendSms,
    importExcelData
}