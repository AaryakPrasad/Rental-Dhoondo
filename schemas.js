const joi = require('joi')
module.exports.rentalSchema = joi.object({
    rental: joi.object({
        price: joi.number().required().min(0),
        title: joi.string().required(),
        image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string(),
    }).required()
})

