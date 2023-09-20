const express = require('express')

const userRouter = require('./user/routes/userRoutes');
const categoryRouter = require('./admin/routes/categoryRoutes')
const bookRouter = require('./admin/routes/bookRoutes')
const reviewRouter = require('./user/routes/reviewRoutes')

const commonRouter = express.Router()

commonRouter.use('/users', userRouter);
commonRouter.use('/category', categoryRouter)
commonRouter.use('/books', bookRouter)
commonRouter.use('/reviews', reviewRouter)

module.exports = commonRouter
