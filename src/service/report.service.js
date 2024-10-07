const pool = require('../config/db')
const ErrorResponse = require('../utils/errorResponse');

const createReport = async (client, sendMessage, user_id, summa) => {
    try {
        await pool.query(
            `INSERT INTO reports (client_fio, client_phone, report, senddate, user_id, tashkilot, summa) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,[client.fio, client.phone, sendMessage, new Date(), user_id, client.tashkilot, client.summa]);
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

const getAllReportByDate = async (id, offset, limit, date, phone, tashkilot) => {
    try {
        const params = [id, offset, limit]
        let dateFilter = ``
        let phoneFilter = ``
        let tashkilotFilter = ``
        if(date){
            dateFilter = `AND senddate = $${params.length + 1}`
            params.push(date)
        }
        if(phone){
            phoneFilter = `AND client_phone = $${params.length + 1}`
            params.push(phone)
        }
        if(tashkilot === 'true'){
            tashkilotFilter = `AND tashkilot IS NOT NULL`
        }
        if(tashkilot === 'false'){
            tashkilotFilter = `AND tashkilot IS NULL`
        }
        const smses = await pool.query(
            `SELECT id, report, client_fio, senddate, client_phone, tashkilot
            FROM reports
            WHERE user_id = $1 AND isdeleted = false ${dateFilter} ${phoneFilter} ${tashkilotFilter}
            OFFSET $2 
            LIMIT $3
        `,params);
        return smses.rows;
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdReportService = async (user_id, id) => {
    try {
        const sms = await pool.query(
            `SELECT id, report, client_fio, senddate, client_phone, tashkilot
            FROM reports
            WHERE user_id = $1 AND id = $2 AND isdeleted = false
        `,[user_id, id]);
        if(!sms.rows[0]){
            throw new ErrorResponse('sms not found', 404)
        }
        return sms.rows[0];
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const deleteReportService = async (id) => {
    try { 
        await pool.query(`UPDATE reports SET isdeleted = true WHERE id = $1`, [id])        
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByPhoneReport = async (user_id, phone) => {
    try {
        const reports = await pool.query(`SELECT senddate, client_phone, tashkilot, summa
            FROM reports
            WHERE user_id = $1 AND client_phone = $2 AND isdeleted = false
        `, [user_id, phone])
        return reports.rows
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    createReport,
    getAllDateReport,
    getAllReportByDate,
    getByIdReportService,
    deleteReportService,
    getByPhoneReport
}