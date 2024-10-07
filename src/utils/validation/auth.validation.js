const Joi = require('joi')

const loginValidation = Joi.object({
    login: Joi.string().required(), 
    password: Joi.string().required()
})

const updateValidation = Joi.object({
    login: Joi.string().required(), 
    username: Joi.string().required(), 
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})

module.exports = {
    loginValidation,
    updateValidation
}