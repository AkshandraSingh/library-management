const userValidationSchema = require('./userValSchema')

module.exports = {
    // Validator for signup 
    signupUserValidation: async (req, res, next) => {
        const value = await userValidationSchema.signupUser.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    // Validator for user login 
    userLoginValidation: async (req, res, next) => {
        const value = await userValidationSchema.userLogin.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    // Validator for reset password 
    resetPasswordValidation: async (req, res, next) => {
        const value = await userValidationSchema.resetPassword.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },

    // Validator for set new password
    setNewPasswordValidation: async (req, res, next) => {
        const value = await userValidationSchema.setNewPassword.validate(req.body, { abortEarly: false })
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
