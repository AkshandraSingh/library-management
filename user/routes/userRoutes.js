const express = require('express')

const userController = require('../controllers/userController')
const { isUser } = require('../../middlewares/authService')
const userValidator = require('../../validations/userValidations/userValidator')
const imageStorage = require('../../middlewares/imageStorage')
const { userAuthentication } = require('../../middlewares/authToken')

const userRouter = express.Router()

userRouter.post('/signupUser', userValidator.signupUserValidation, userController.signupUser)
userRouter.post('/userLogin', isUser, userValidator.userLoginValidation, userController.loginUser)
userRouter.post('/forgetPassword', userController.forgetPassword)
userRouter.post('/resetPassword/:userId/:token', userValidator.resetPasswordValidation, userController.resetPassword)
userRouter.post('/setNewPassword/:userId', userAuthentication, userValidator.setNewPasswordValidation, userController.setNewPassword)
userRouter.get('/viewProfile/:userId', userAuthentication, userController.viewProfile)
userRouter.patch('/editProfile/:userId', userAuthentication, imageStorage.profilePicUpload.single('userProfilePic'), userController.editProfile)
userRouter.get('/userDashBoard', userAuthentication, userController.userDashBoard)

module.exports = userRouter
