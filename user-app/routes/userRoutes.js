const express = require('express')

const userController = require('../controllers/userController')

const userRouter = express.Router()

userRouter.post('/signupUser', userController.signupUser)

module.exports = userRouter
