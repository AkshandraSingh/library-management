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

module.exports = {
    adminDashBoard,
}
