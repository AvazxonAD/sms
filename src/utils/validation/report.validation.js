const Joi = require('joi')

const queryValidation = Joi.object({
    date : Joi.string().pattern(/^\d{2}\.\d{2}\.\d{4}$/),
    page: Joi.number(),
    limit: Joi.number(),
    phone: Joi.string().pattern(/^998\d{9}$/),
    tashkilot: Joi.string()
})


module.exports = {
    queryValidation
}