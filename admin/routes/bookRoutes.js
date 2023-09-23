const express = require('express');

const bookController = require('../controllers/bookController');
const imageStorage = require('../../middlewares/imageStorage');

const bookRouter = express.Router();

bookRouter.post('/addBook', imageStorage.bookImageUpload.single('bookImage'), bookController.addBook);
bookRouter.patch('/editBook/:bookId', bookController.editBook);
bookRouter.delete('/deleteBook/:bookId', bookController.deleteBook)
bookRouter.get('/searchBookByName/:bookName', bookController.searchBookByName)
bookRouter.get('/searchBookByCategory/:categoryName', bookController.searchBookByCategory)
bookRouter.get('/bookDetails/:bookId', bookController.bookDetails)
bookRouter.get('/borrowBooks/:userId/:bookId', bookController.borrowBooks)
bookRouter.get('/returnBook/:userId/:bookId', bookController.returnBook)
bookRouter.get('/likeDislikeBook/:userId/:bookId', bookController.likeDislikeBook)

module.exports = bookRouter;
