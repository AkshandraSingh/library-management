const mongoose = require('mongoose')

const booksModel = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    bookDescription: {
        type: String,
        required: true,
    },
    bookAuthor: {
        type: String,
        required: true,
    },
    bookPdf: {
        type: String,
        required: true,
    },
    bookCategory: {
        type: String,
        required: true,
    },
    bookImage: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

booksModel.set('timestamps', true)

module.exports = mongoose.model('books', booksModel)