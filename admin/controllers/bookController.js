const bookModel = require('../../models/booksModel');
const categoryModel = require('../../models/categoryModel')
const reviewModel = require('../../models/reviewsModel')
const bookLogger = require('../../utils/bookLogger/bookLogger')

const addBook = async (req, res) => {
    try {
        // Adding Book image tile 
        const bookImage = `/uploads/BooksImages/${req.file.filename}`;
        // Checking is category exist in category model or not 
        const isCategoryExist = await categoryModel.findOne({
            categoryName: req.body.bookCategory
        })
        if (!isCategoryExist && req.body.bookCategory === "common") {
            // if category not found
            bookLogger.log('error', 'Category not exist in database')
            return res.status(401).send({
                success: false,
                message: "Category not exist in database",
            })
        }
        // creating new book
        const newBook = new bookModel({
            bookName: req.body.bookName,
            bookDescription: req.body.bookDescription,
            bookAuthor: req.body.bookAuthor,
            bookCategory: req.body.bookCategory,
            bookImage,
            bookCost: req.body.bookCost
        });
        // save the book data
        await newBook.save();
        bookLogger.log('info', 'Book added successfully')
        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: newBook,
        });
    } catch (error) {
        // req.file ? unlinkSync(req.file.path) : null
        bookLogger.log('error', `Error: ${error.message}`)
        res.status(500).json({
            success: false,
            message: "Error: Unable to add the book",
            error: error.message,
        });
    }
};

const editBook = async (req, res) => {
    try {
        // Takeing bookId form params
        const { bookId } = req.params
        const bookImage = req.file ? `/upload/booksImages/${req.file.filename}` : undefined;
        // updating the book  data
        const bookData = await bookModel.findByIdAndUpdate(bookId, {
            bookName: req.body.bookName || undefined,
            bookDescription: req.body.bookDescription || undefined,
            bookAuthor: req.body.bookAuthor || undefined,
            bookImage: bookImage,
        }, {
            new: true,
        })
        if (bookData) {
            // if book id is correct
            bookLogger.log('info', 'Book updated!')
            return res.status(200).send({
                success: true,
                message: "Book updated!",
                bookData: bookData,
            })
        }
        // if book data not found (BookId not correct)
        bookLogger.log('error', 'Book not found!')
        res.status(401).send({
            success: false,
            message: "Book not found!"
        })
    } catch (error) {
        bookLogger.log('error', `Error: ${error.message}`)
        res.status(500).json({
            success: false,
            message: "Error",
            error: error.message,
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        // Takeing bookId form params
        const { bookId } = req.params
        // if deleting the bookData from bookId
        const bookData = await bookModel.findByIdAndDelete(bookId);
        if (bookData) {
            // if book id is correct 
            bookLogger.log('info', 'Book deleted!')
            return res.status(200).send({
                success: true,
                message: "Book deleted!",
                bookDeleteData: bookData,
            })
        }
        // if book data not found (BookId not correct
        bookLogger.log('error', 'Book not found!')
        res.status(401).send({
            success: false,
            message: "Book not found!"
        })
    } catch (error) {
        bookLogger.log('error', `Error: ${error.message}`)
        res.status(500).json({
            success: false,
            message: "Error",
            error: error.message,
        });
    }
}

const searchBookByName = async (req, res) => {
    try {
        const { bookName } = req.params
        // regex for case sensitive
        const bookSearchData = await bookModel.find({ bookName: { $regex: `^${bookName}`, $options: "i" } })
            .select('bookName bookImage');
        if (bookSearchData.length <= 0) {
            // not any book found by name
            bookLogger.log('error', 'Book not found!')
            return res.status(400).send({
                success: false,
                message: "Book not found!"
            })
        }
        // if at least one book found
        bookLogger.log('info', 'These books found')
        res.status(200).send({
            success: true,
            message: "These books found",
            bookFound: bookSearchData,
        })
    } catch (error) {
        bookLogger.log('error', `Error: ${error.message}`)
        res.status(500).json({
            success: false,
            message: "Error",
            error: error.message,
        });
    }
}

const searchBookByCategory = async (req, res) => {
    try {
        // Takeing category Name form params
        const { categoryName } = req.params
        // checking is category exist in data base or not
        const isCategoryExist = await categoryModel.findOne({
            categoryName: categoryName
        })
        if (!isCategoryExist) {
            // if category not found
            bookLogger.log('error', 'Category not exist in database')
            return res.status(401).send({
                success: false,
                message: "Category not exist in database",
            })
        }
        // Extract the book data form data base and show only bookName bookImage
        const bookSearchData = await bookModel.find({
            bookCategory: categoryName
        }).select('bookName bookImage');
        bookLogger.log('info', 'Book search data found!')
        res.status(200).send({
            success: true,
            message: "Book search data found!",
            bookData: bookSearchData,
        })
    } catch (error) {
        bookLogger.log('error', `Error: ${error.message}`)
        res.status(500).json({
            success: false,
            message: "Error",
            error: error.message,
        });
    }
}

const bookDetails = async (req, res) => {
    try {
        // Takeing bookId form params
        const { bookId } = req.params
        // finding whole book data form bookId
        const bookData = await bookModel.findById(bookId)
        // select the only data which user can see
        const bookSelectedData = await bookModel.findById(bookId).select('bookName bookDescription bookAuthor bookCategory bookImage bookCost')
        // if book data found in data base
        if (bookData) {
            // checking the book is Available 
            let isAvailable = "Available"
            // if book is not Available
            if (bookData.bookStatus != "Available") {
                isAvailable = "not available"
            }
            // finding the review data and extract only rating
            const reviewData = await reviewModel.find({
                bookId: bookId
            }).select('rating')
            // calculating the average rating of book
            const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviewData.length;
            bookLogger.log('info', 'Book details found!')
            res.status(200).send({
                success: true,
                message: "Book details found",
                isAvailable: isAvailable,
                bookData: bookSelectedData,
                averageRating: averageRating,
            })
        } else {
            // if book not found
            bookLogger.log('error', 'Book not found!')
            res.status(401).send({
                success: false,
                message: "Book not found!"
            })
        }
    } catch (error) {
        bookLogger.log('error', `Error: ${error.message}`)
        res.status(500).json({
            success: false,
            message: "Error",
            error: error.message,
        });
    }
}

// Exporting the API
module.exports = {
    addBook,
    editBook,
    deleteBook,
    searchBookByName,
    searchBookByCategory,
    bookDetails,
}
