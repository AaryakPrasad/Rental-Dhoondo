const basejoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                })
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})

const joi = basejoi.extend(extension)


module.exports.rentalSchema = joi.object({
    rental: joi.object({
        price: joi.number().required().min(0),
        title: joi.string().required().escapeHTML(),
        description: joi.string().allow('', null).escapeHTML(),
        location_name: joi.string().required().escapeHTML(),
        location_place_id: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})
