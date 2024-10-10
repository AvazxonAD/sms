const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { returnLocalDate, returnDate } = require('../utils/date.functions');
const { getAllDateReport, getAllReportByDate, getByIdReportService, deleteReportService, getByPhoneReport } = require("../service/report.service");
const { queryValidation, byPhoneValidation } = require('../utils/validation/report.validation');
const { validationResponse } = require("../utils/validation.response");
const { errorCatch } = require("../utils/errorCtach");
const { resFunc } = require("../utils/resFunc");
const { getReportString } = require('../service/sms.service');
const { smsString, reportStrinng } = require("../utils/smsString");

// get all dates 
exports.getAllDates = async (req, res) => {
  try {
    const dates = await getAllDateReport(req.user.id)
    const result = dates.map(date => {
      return returnLocalDate(date.senddate)
    })
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all reports 
exports.getAllSmses = async (req, res) => {
  try {
    let date = null
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
      return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;
    const query = validationResponse(queryValidation, req.query)
    if (query.date) {
      date = returnDate(query.date)
    }
    const smses = await getAllReportByDate(req.user.id, offset, limit, date, query.phone, query.tashkilot)
    const result = smses.map(report => {
      report.senddate = returnLocalDate(report.senddate)
      return report
    })
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete 
exports.deleteReport = async (req, res) => {
  try {
    const id = req.params.id
    const user_id = req.user.id
    await getByIdReportService(user_id, id)
    await deleteReportService(id)
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}


// get elemt by id 
exports.getElementById = async (req, res) => {
  try {
    const report = await getByIdReportService(req.user.id, req.params.id)
    resFunc(res, 200, report)
  } catch (error) {
    errorCatch(error, res)
  }
}

exports.getByPhone = async (req, res) => {
  try {
    const user_id = req.user.id
    const { phone, date1, date2 } = validationResponse(byPhoneValidation, req.query)
    const dt1 = returnDate(date1)
    const dt2 = returnDate(date2)
    const data = await getByPhoneReport(user_id, phone, dt1, dt2)
    const rows = data.map(report => {
      const object = { ...report }
      object.senddate = returnLocalDate(object.senddate)
      delete object.client_fio
      delete object.tashkilot
      return object
    })
    const smsText = await getReportString(user_id)
    const sms_report = reportStrinng(smsText.report_string, data[0].client_fio)
    const result = { client_fio: data[0].client_fio, report_string: sms_report, tashkilot: data[0].tashkilot, rows }
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}