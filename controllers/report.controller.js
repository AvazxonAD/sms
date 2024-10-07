const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const {
  returnLocalDate,
  returnDate
} = require('../utils/date.functions');
const { getAllDateReport, getAllReportByDate } = require("../service/report.service");
const { isValidDate } = require("../utils/check.functions");

// get all dates 
exports.getAllDates = asyncHandler(async (req, res, next) => {
  const dates = await getAllDateReport(req.user.id)
  const result = dates.map(date => {
    return returnLocalDate(date.senddate)
  })

  res.status(200).json({
    success: true,
    data: result
  })
})

// get all reports 
exports.getAllSmses = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (limit <= 0 || page <= 0) {
      return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
  }

  const offset = (page - 1) * limit;

  const date = returnDate(req.query.date) 
  isValidDate(date)

  const smses = await getAllReportByDate(req.user.id, date, offset, limit)

  const result = smses.map(report => {
    report.senddate = returnLocalDate(report.senddate)
    return report
  })

  res.status(200).json({
    success: true,
    data: result
  })
})

// delete 
exports.deleteReport = asyncHandler(async (req, res, next) => {
  let report = await pool.query(`DELETE FROM reports where id = $1 RETURNING *`, [req.params.id])
  report = report.rows[0]
  if (!report) {
    return next(new ErrorResponse('server xatolik', 500))
  }
  return res.status(200).json({
    success: true,
    data: report
  })
})

// search by  phone 
exports.searchByPhone = asyncHandler(async (req, res, next) => {
  const { phone } = req.body
  if (!phone) {
    return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
  }

  if (typeof phone !== "string") {
    return next(new ErrorResponse('Malumotlar tog`ri formatda kiritilishi kerak'))
  }

  const regex = /^[1-9]\d{8}$/
  const phoneTest = regex.test(phone.trim())
  if (!phoneTest) {
    return next(new ErrorResponse(`Telefon raqami notog'ri kiritildi : ${phone}. Tog'ri format : 992996937`, 400))
  }

  const result = await pool.query(`SELECT id, report, client_fio AS username, senddate, client_phone AS phone 
    FROM reports WHERE user_id = $1 AND client_phone = $2
  `, [req.user.id, phone])
    
  return res.status(200).json({
    success: true,
    data: result.rows
  })

})

// get elemt by id 
exports.getElementById = asyncHandler(async (req, res, next) => {
  let report = await pool.query(`SELECT id, report, client_fio AS username, senddate, client_phone AS phone  
    FROM reports WHERE user_id = $1 AND id = $2
  `, [req.user.id, req.params.id])
  
  report = report.rows[0]
  if(!report){
    return next(new ErrorResponse("Server xatolik. Xisobot topilmadi", 500))
  }

  return res.status(200).json({
    success: true, 
    data: report
  })
  
})