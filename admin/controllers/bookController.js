const bookModel = require('../../models/booksModel');
const categoryModel = require('../../models/categoryModel')

const addBook = async (req, res) => {
    try {
        const bookImage = `/uploads/BooksImages/${req.file.filename}`;
        const isCategoryExist = await categoryModel.findOne({
            categoryName: req.body.bookCategory
        })
        if (!isCategoryExist) {
            return res.status(401).send({
                success: false,
                message: "Category not exist in database",
            })
        }
        const newBook = new bookModel({
            bookName: req.body.bookName,
            bookDescription: req.body.bookDescription,
            bookAuthor: req.body.bookAuthor,
            bookCategory: req.body.bookCategory,
            bookImage,
        });
        await newBook.save();
        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: newBook,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error: Unable to add the book",
            error: error.message,
        });
    }
};

const editBook = async (req, res) => {
    try {
        const { bookId } = req.params
        const bookImage = req.file ? `/upload/booksImages/${req.file.filename}` : undefined;
        const bookData = await bookModel.findByIdAndUpdate(bookId, {
            bookName: req.body.bookName || undefined,
            bookDescription: req.body.bookDescription || undefined,
            bookAuthor: req.body.bookAuthor || undefined,
            bookImage: bookImage,
        }, {
            new: true,
        })
        if (bookData) {
            return res.status(200).send({
                success: true,
                message: "Book updated!",
                bookData: bookData,
            })
        }
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
        const { bookId } = req.params
        const bookData = await bookModel.findByIdAndDelete(bookId);
        if (bookData) {
            return res.status(200).send({
                success: true,
                message: "Book deleted!",
                bookDeleteData: bookData,
            })
        }
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


module.exports = {
    addBook,
    editBook,
    deleteBook,
}
