const joi = require('joi')
module.exports.rentalSchema = joi.object({
    rental: joi.object({
        price: joi.number().required().min(0),
        title: joi.string().required(),
        location: joi.string().required(),
        description: joi.string()
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
})
