const pool = require('../config/db')
const ErrorResponse = require('../utils/errorResponse')

const createUserService = async (username, password) => {
    try {
        const user = await pool.query(`INSERT INTO users(username, password) VALUES($1, $2) RETURNING * `, [username, password])
        return user.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getUserService = async () => {
    try {
        const users = await pool.query(`SELECT * FROM users WHERE isdeleted = false`)
        return users.rows
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getUserByLoginService = async (login) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE login = $1 AND isdeleted = false', [login]);
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getUserByIdService = async (id) => {
    try {
        const result = await pool.query('SELECT id, username FROM users WHERE id = $1 AND isdeleted = false', [id]);
        if(!result.rows[0]){
            throw new ErrorResponse('user not found', 404)
        }
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getPasswordByIdService = async (id) => {
    try {
        const result = await pool.query('SELECT password FROM users WHERE id = $1 AND isdeleted = false', [id]);
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const updateUserService = async (username, password, id, login) => {
    try {
        const result = await pool.query(`UPDATE users 
            SET username = $1, password = $2, login = $3
            WHERE id = $4 RETURNING *
        `, [username, password, login, id]);
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getBalanceService = async (user_id) => {
    try {
        const balance = await pool.query(`SELECT balance FROM balance WHERE user_id = $1 AND isdeleted = false`, [user_id])
        if(!balance.rows[0]){
            throw new ErrorResponse('balance not found', 404)
        }
        return balance.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getSmsTextService = async (user_id) => {
    try {
        const sms_text = await pool.query(`SELECT sms_string, report_string FROM sms_text WHERE user_id = $1 AND isdeleted = false`, [user_id])
        if(!sms_text.rows[0]){
            throw new ErrorResponse('sms string not found', 404)
        }
        return sms_text.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    createUserService,
    getUserService,
    getUserByLoginService,
    getUserByIdService,
    updateUserService,
    getPasswordByIdService,
    getBalanceService,
    getSmsTextService
}