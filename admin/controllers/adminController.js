const userModel = require('../../models/userModel')
const bookModel = require('../../models/booksModel')
const categoryModel = require('../../models/categoryModel')

const adminDashBoard = async (req, res) => {
    try {
        const usersData = await userModel.find({}).count()
        const booksData = await bookModel.find({}).count()
        const categoriesData = await categoryModel.find({}).count()
        res.status(200).send({
            success: true,
            message: "Admin DashBoard",
            allUsers: usersData,
            allBooks: booksData,
            allCategories: categoriesData,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message
        })
    }
}

const viewUsers = async (req, res) => {
    try {
        const usersData = await userModel.find({}).select('userName userPhone userEmail userProfilePic')
        res.status(200).send({
            success: true,
            message: "All Uses Data",
            usersData: usersData,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message
        })
    }
}

const userDetails = async (req, res) => {
    try {
        const { userId } = req.params
        const userData = await userModel.findById(userId).select('userName userPhone userEmail userProfilePic userGender borrowBooks')
        if (userData) {
            res.status(200).send({
                success: true,
                message: "User data found!",
                userData: userData
            })
        } else {
            res.status(400).send({
                success: false,
                message: "User not found!",
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message
        })
    }
}

const borrowBooksList = async (req, res) => {
    try {
        const borrowBooks = await bookModel.find({
            bookStatus: "not available"
        }).select('bookName bookAuthor bookCategory bookImage bookCost')
        res.status(200).send({
            success: true,
            message: "Borrow books list",
            books: borrowBooks
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message
        })
    }
}

module.exports = {
    adminDashBoard,
    viewUsers,
    userDetails,
    borrowBooksList,
}
