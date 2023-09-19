const express = require('express')

const userController = require('../controllers/userController')
const { isUser } = require('../../middlewares/authService')

const userRouter = express.Router()

userRouter.post('/signupUser', userController.signupUser)
userRouter.post('/userLogin', isUser, userController.loginUser)
userRouter.post('/forgetPassword', userController.forgetPassword)
userRouter.post('/resetPassword/:userId/:token', userController.resetPassword)
userRouter.post('/setNewPassword/:userId', userController.setNewPassword)

module.exports = userRouter
