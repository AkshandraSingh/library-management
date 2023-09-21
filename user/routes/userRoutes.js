const express = require('express')

const userController = require('../controllers/userController')
const { isUser } = require('../../middlewares/authService')
const userValidator = require('../../validations/userValidations/userValidator')

const userRouter = express.Router()

userRouter.post('/signupUser', userValidator.signupUserValidation, userController.signupUser)
userRouter.post('/userLogin', isUser, userValidator.userLoginValidation, userController.loginUser)
userRouter.post('/forgetPassword', userController.forgetPassword)
userRouter.post('/resetPassword/:userId/:token', userValidator.resetPasswordValidation, userController.resetPassword)
userRouter.post('/setNewPassword/:userId', userValidator.setNewPasswordValidation, userController.setNewPassword)

module.exports = userRouter
