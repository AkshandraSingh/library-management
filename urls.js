const express = require('express')

const userRouter = require('./user/routes/userRoutes');;
const categoryRouter = require('./admin/routes/categoryRoutes')

const commonRouter = express.Router()

commonRouter.use('/users', userRouter);
commonRouter.use('/category', categoryRouter)

module.exports = commonRouter
