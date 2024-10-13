const Joi = require('joi')

const smsValidation = Joi.object({
    data: Joi.array().items(
        Joi.object({
            fio: Joi.string().required(),
            phone: Joi.string().pattern(/^998\d{9}$/).required(),
            summa: Joi.string().required(),
            tashkilot: Joi.string().allow(null)
        })
    ).required()
});

module.exports = {
    smsValidation
}