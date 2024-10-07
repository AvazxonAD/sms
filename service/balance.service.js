const pool = require('../config/db')
const ErrorResponse = require('../utils/errorResponse');

const updateBalance = async (balance, user_id) => {
    try {
        await pool.query(`UPDATE balance SET balance = $1 WHERE user_id = $2 AND isdeleted = false`, [balance, user_id])
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}


module.exports = {
    updateBalance
}