const express = require('express')

const reviewController = require('../controllers/reviewController')
const reviewValidation = require('../../validations/reviewValidations/reviewValidator')
const { userAuthentication } = require('../../middlewares/authToken')

const reviewRouter = express.Router()

reviewRouter.post('/addReview/:userId/:bookId', userAuthentication, reviewValidation.addReview, reviewController.addReview)
reviewRouter.patch('/editReview/:reviewId', userAuthentication, reviewController.editReview)
reviewRouter.delete('/deleteReview/:reviewId', userAuthentication, reviewController.deleteReview)
reviewRouter.get('/allReviewsOfBook/:bookId', userAuthentication, reviewController.allReviewsOfBook)

module.exports = reviewRouter
