const reviewSchema = require('./reviewValSchema')

module.exports = {
    // Add review validation 
    addReview: async (req, res, next) => {
        const value = await reviewSchema.addReview.validate(req.body, { abortEarly: false })
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
