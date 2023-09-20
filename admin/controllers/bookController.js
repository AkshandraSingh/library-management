const bookModel = require('../../models/booksModel');
const categoryModel = require('../../models/categoryModel')

const addBook = async (req, res) => {
    try {
        // Adding Book image tile 
        const bookImage = `/uploads/BooksImages/${req.file.filename}`;
        // Checking is category exist in category model or not 
        const isCategoryExist = await categoryModel.findOne({
            categoryName: req.body.bookCategory
        })
        if (!isCategoryExist) {
            // if category not found
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
        });
        // save the book data
        await newBook.save();
        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: newBook,
        });
    } catch (error) {
        req.file ? unlinkSync(req.file.path) : null
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
            return res.status(200).send({
                success: true,
                message: "Book updated!",
                bookData: bookData,
            })
        }
        // if book data not found (BookId not correct)
        res.status(401).send({
            success: false,
            message: "Book not found!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Unable to add the book",
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
            return res.status(200).send({
                success: true,
                message: "Book deleted!",
                bookDeleteData: bookData,
            })
        }
        // if book data not found (BookId not correct
        res.status(401).send({
            success: false,
            message: "Book not found!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Unable to add the book",
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
            // not any book found
            return res.status(400).send({
                success: false,
                message: "Book not found!"
            })
        }
        // if at least one book found
        res.status(200).send({
            success: true,
            message: "These books found",
            bookFound: bookSearchData,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Unable to add the book",
            error: error.message,
        });
    }
}

const searchBookByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params
        const isCategoryExist = await categoryModel.findOne({
            categoryName: categoryName
        })
        if (!isCategoryExist) {
            // if category not found
            return res.status(401).send({
                success: false,
                message: "Category not exist in database",
            })
        }
        const bookSearchData = await bookModel.find({
            bookCategory: categoryName
        }).select('bookName bookImage');
        res.status(200).send({
            success: true,
            message: "Book Search Data",
            bookData: bookSearchData,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Unable to add the book",
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
}
