const joi = require('joi')

const categorySchema = {
    // Add category validation 
    addCategory: joi.object({
        categoryName: joi
            .string()
            .max(20)
            .min(2)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-man": "{#label} should be at least {#limit} characters",
            })
            .required(),
    }).unknown(true),
}

module.exports = categorySchema
