const categorySchema = require('./categoryValSchema')

module.exports = {
    // Add category validator 
    addCategory: async (req, res, next) => {
        const value = await categorySchema.addCategory.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },
}
