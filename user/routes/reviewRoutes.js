const express = require('express')

const reviewController = require('../controllers/reviewController')

const reviewRouter = express.Router()

reviewRouter.post('/addReview/:userId/:bookId', reviewController.addReview)
reviewRouter.patch('/editReview/:reviewId', reviewController.editReview)
reviewRouter.delete('/deleteReview/:reviewId', reviewController.deleteReview)

module.exports = reviewRouter
