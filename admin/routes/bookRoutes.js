const express = require('express');
const bookController = require('../controllers/bookController');
const imageStorage = require('../../middlewares/imageStorage');

const bookRouter = express.Router();

bookRouter.post('/addBook', imageStorage.bookImageUpload.single('bookImage'), bookController.addBook);

module.exports = bookRouter;
