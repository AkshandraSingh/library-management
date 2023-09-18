const express = require('express')

const userRouter = require('./user-app/routes/userRoutes')

const commonRouter = express.Router()

commonRouter.use('/users', userRouter);

module.exports = commonRouter
