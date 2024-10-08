const pool = require('../config/db')
const asyncFunctionHandler = require('../middlewares/asyncFunctionHandler')
const ErrorResponse = require('../utils/errorResponse')

const getSmsText = asyncFunctionHandler(async (user_id) => {
    const result = await pool.query(`SELECT sms_string FROM sms_text WHERE user_id = $1 AND isdeleted = false`, [user_id])
    return result.rows[0]
})

const getReportString = async (user_id) => {
    try {
        const result = await pool.query(`SELECT report_string FROM sms_text WHERE user_id = $1 AND isdeleted = false`, [user_id])
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    getSmsText,
    getReportString
}