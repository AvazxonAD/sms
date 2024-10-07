const pool = require('../config/db')
const asyncFunctionHandler = require('../middlewares/asyncFunctionHandler')

const getSmsText = asyncFunctionHandler(async (id) => {
    const result = await pool.query(`SELECT sms_string FROM sms_text WHERE user_id = $1 AND isdeleted = false`, [id])
    return result.rows[0]
})

module.exports = {
    getSmsText
}