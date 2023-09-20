const mongoose = require('mongoose')

const reviewModel = new mongoose.Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    bookId: {
        type: mongoose.Types.ObjectId,
        ref: 'books',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

reviewModel.set('timestamps', true)

module.exports = mongoose.model('reviews', reviewModel)
