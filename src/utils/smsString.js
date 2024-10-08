const asyncFunctionHandler = require("../middlewares/asyncFunctionHandler")
const returnSumma = require('../utils/returnSumma')

const smsString = (shablon, info) => {
  return shablon
    .replace('fio', info.fio)
    .replace('summa', returnSumma(info.summa));
}

const reportStrinng = (shablon, info) => {
  return shablon
    .replace('fio', info)
}

module.exports = { smsString, reportStrinng }