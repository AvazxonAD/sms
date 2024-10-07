const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const generateToken = require('../utils/ganerate.token');
const bcrypt = require('bcrypt');
const { 
    getUserByUsername,
    getUserById,
    updateUser,
    getPasswordById
} = require('../service/users.service')

const { getBalance } = require('../service/balance.service')

const {
    checkValueString,
} = require('../utils/check.functions')

// login 
const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    checkValueString(username, password)
    
    const user = await getUserByUsername(username)

    if (!user) {
        return next(new ErrorResponse("Username yoki parol xato kiritildi", 403));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return next(new ErrorResponse("Username yoki parol xato kiritildi", 403));
    }

    const token = generateToken(user);

    return res.status(200).json({
        success: true,
        data: user.username,
        token
    });
});

// get profile 
const getProfile = asyncHandler(async (req, res, next) => {
    const user = await getUserById(req.user.id)

    if (!user) {
        return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// update users 
const update = asyncHandler(async (req, res, next) => {
    const { username, oldPassword, newPassword } = req.body;
    const id = req.user.id

    checkValueString(username, oldPassword, newPassword)

    const user = await getPasswordById(id)

    if (!user) {
        return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        return next(new ErrorResponse("Eski parol noto'g'ri", 403));
    }
    
    /*const regex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/;
    if (!regex.test(newPassword)) {
        return next(new ErrorResponse("Parol kamida 8 ta belgidan iborat bo'lishi, harflar va raqamlarni o'z ichiga olishi kerak", 400));
    }*/

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await updateUser(username, hashedPassword, id)
    if(!result){
        return next(new ErrorResponse("Server xatolik. Malumot yangilanmadi", 500))
    }
    
    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    });
});

// get balanc
const getBalanc = asyncHandler(async (req, res, next) => {
    const balance = await getBalance()
    
    res.status(200).json({
        success: true,
        data: balance
    })
})

module.exports = {
    login,
    getProfile,
    update,
    getBalanc
}