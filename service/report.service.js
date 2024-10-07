const pool = require('../config/db')
const asyncFunctionHandler = require('../middlewares/asyncFunctionHandler')

const createReport = asyncFunctionHandler(async (client, sendMessage, id) => {
    await pool.query(
        `INSERT INTO reports (client_fio, client_phone, report, senddate, user_id, tashkilot) 
        VALUES ($1, $2, $3, $4, $5, $6)
    `,[client.fio, client.phone, sendMessage, new Date(), id, client.tashkilot]);
})

const getAllDateReport = asyncFunctionHandler(async (id) => {
    const dates = await pool.query(`SELECT DISTINCT(senddate) FROM reports WHERE user_id = $1 AND isdeleted = false ORDER BY senddate DESC`, [id])
    return dates.rows
})

const getAllReportByDate = asyncFunctionHandler(async (id, date, offset, limit ) => {
    const smses = await pool.query(
        `SELECT id, report, client_fio, senddate, client_phone, tashkilot
        FROM reports
        WHERE senddate = $1 AND user_id = $2
        OFFSET $3 
        LIMIT $4
    `,[date, id, offset, limit]);
    return smses.rows;
})

const getAllTotal = asyncFunctionHandler(async )

module.exports = {
    createReport,
    getAllDateReport,
    getAllReportByDate
}