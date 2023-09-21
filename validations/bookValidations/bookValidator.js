const bookSchema = require('./bookValSchema')

module.exports = {
    // Add book validator 
    addBook: async (req, res, next) => {
        const value = await bookSchema.addBook.validate(req.body, { abortEarly: false })
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
