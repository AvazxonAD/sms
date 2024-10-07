const pool = require('../config/db')
const asyncFunctionHandler = require('../middlewares/asyncFunctionHandler');
const ErrorResponse = require('../utils/errorResponse');

const createReport = async (client, sendMessage, user_id) => {
    try {
        await pool.query(
            `INSERT INTO reports (client_fio, client_phone, report, senddate, user_id, tashkilot) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `,[client.fio, client.phone, sendMessage, new Date(), user_id, client.tashkilot]);
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getAllDateReport = async (user_id) => {
    try {
        const dates = await pool.query(`SELECT DISTINCT(senddate) FROM reports WHERE user_id = $1 AND isdeleted = false ORDER BY senddate DESC`, [user_id])
        return dates.rows
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getAllReportByDate = async (id, date, offset, limit ) => {
    try {
        const smses = await pool.query(
            `SELECT id, report, client_fio, senddate, client_phone, tashkilot
            FROM reports
            WHERE senddate = $1 AND user_id = $2
            OFFSET $3 
            LIMIT $4
        `,[date, id, offset, limit]);
        return smses.rows;
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}


module.exports = {
    createReport,
    getAllDateReport,
    getAllReportByDate
}