const ErrorResponse = require('../utils/errorResponse');
const generateToken = require('../utils/ganerate.token');
const bcrypt = require('bcrypt');
const { loginValidation, updateValidation } = require('../utils/validation/auth.validation')
const { validationResponse } = require('../utils/validation.response')
const { errorCatch } = require('../utils/errorCtach')
const { resFunc } = require('../utils/resFunc')
const {
    getUserByLoginService,
    getUserByIdService,
    updateUserService,
    getPasswordByIdService,
    getBalanceService,
    getSmsTextService
} = require('../service/users.service')

// login 
const login = async (req, res) => {
    try {
        const data = validationResponse(loginValidation, req.body)
        const test = await getUserByLoginService(data.login)
        if (!test) {
            throw new ErrorResponse("Incorrect login or password entered", 403)
        }
        const match = await bcrypt.compare(data.password, test.password);
        if (!match) {
            throw new ErrorResponse("Incorrect login or password entered", 403)
        }
        const user = await getUserByIdService(test.id)
        const token = generateToken(user);
        const result = { user: user, token}
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

// get profile 
const getProfile = async (req, res) => {
    try {
        const user = await getUserByIdService(req.user.id)
        resFunc(res, 200, user)
    } catch (error) {
        errorCatch(error, res)
    }
}

// update users 
const update = async (req, res) => {
    try {
        const data = validationResponse(updateValidation, req.body)
        const id = req.user.id
        const user = await getPasswordByIdService(id)
        const match = await bcrypt.compare(data.oldPassword, user.password);
        if (!match) {
            throw new ErrorResponse("Incorrect password entered", 403)
        }
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        const result = await updateUserService(data.username, hashedPassword, id, data.login)
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

// get balance
const getBalance = async (req, res) => {
    try {
        const balance = await getBalanceService(req.user.id)
        resFunc(res, 200, balance)
    } catch (error) {
        errorCatch(error, res)
    }
}

// get sms text 
const getSmsText = async (req, res) => {
    try {
        const sms_text = await getSmsTextService(req.user.id)
        resFunc(res, 200, sms_text)
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    login,
    getProfile,
    update,
    getBalance,
    getSmsText
}