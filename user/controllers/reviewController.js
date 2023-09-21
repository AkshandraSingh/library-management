const reviewModel = require('../../models/reviewsModel')
const reviewLogger = require('../../utils/reviewLogger/reviewLogger')

const addReview = async (req, res) => {
    try {
        const { userId, bookId } = req.params
        if (req.body.rating > 5) {
            reviewLogger.log('error', 'Rating limit is 5')
            return res.status(401).send({
                success: false,
                message: "Rating limit is 5"
            })
        }
        const reviewData = new reviewModel(req.body);
        reviewData.userId = userId
        reviewData.bookId = bookId
        await reviewData.save()
        reviewLogger.log('info', 'Review created!')
        res.status(201).send({
            success: true,
            message: "Review created!"
        })
    } catch (error) {
        reviewLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error",
            error: error.message,
        })
    }
}

const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        if (req.body.rating) {
            if (req.body.rating > 5) {
                reviewLogger.log('error', 'Rating limit is 5')
                return res.status(401).send({
                    success: false,
                    message: "Rating limit is 5"
                })
            }
        }
        const reviewData = await reviewModel.findByIdAndUpdate(reviewId, {
            review: req.body.review || undefined,
            rating: req.body.rating || undefined,
        }, {
            new: true,
        })
        reviewLogger.log('info', 'Review is updated!')
        res.status(200).send({
            success: true,
            message: "Review is updated!",
            review: reviewData,
        })
    } catch (error) {
        reviewLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error",
            error: error.message,
        })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const reviewData = await reviewModel.findByIdAndDelete(reviewId)
        reviewLogger.log('info', 'Review is deleted!')
        res.status(200).send({
            success: true,
            message: "Review is deleted!",
            review: reviewData,
        })
    } catch (error) {
        reviewLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error",
            error: error.message,
        })
    }
}

const allReviewsOfBook = async (req, res) => {
    try {
        const { bookId } = req.params
        const reviewData = await reviewModel.find({
            bookId: bookId
        }).select('review rating')
        if (reviewData.length <= 0) {
            reviewLogger.log('error', 'No review found!')
            return res.status(401).send({
                success: false,
                message: "No review found!"
            })
        }
        reviewLogger.log('info', 'Reviews found')
        res.status(200).send({
            success: true,
            message: "Reviews found",
            review: reviewData,
        })
    } catch (error) {
        reviewLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error",
            error: error.message,
        })
    }
}

module.exports = {
    addReview,
    editReview,
    deleteReview,
    allReviewsOfBook,
}
