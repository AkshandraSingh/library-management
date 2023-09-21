const joi = require('joi')

const reviewValidationSchema = {
    addReview: joi.object({
        review: joi
            .string()
            .max(20)
            .min(3)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-man": "{#label} should be at least {#limit} characters",
            })
            .required(),
        rating: joi
            .number()
            .max(5)
            .min(1)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-man": "{#label} should be at least {#limit} characters",
            })
            .required(),
    }).unknown(true),
}

module.exports = reviewValidationSchema
