const categoryModel = require('../../models/categoryModel')
const categoryLogger = require('../../utils/categoryLogger/categoryLogger')

const addCategory = async (req, res) => {
    try {
        // Creating a new instance of category data
        const categoryData = new categoryModel(req.body)
        // Save the category data
        await categoryData.save()
        categoryLogger.log('info', 'Category created!')
        res.status(201).send({
            success: true,
            message: "Category created!",
        })
    } catch (error) {
        categoryLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message,
        })
    }
}

const editCategory = async (req, res) => {
    try {
        // Takeing Category id form params
        const { categoryId } = req.params
        // takeing the category data form database if it present
        const categoryData = await categoryModel.findById(categoryId)
        // checking is category present in database
        if (categoryData) {
            // change the category name
            categoryData.categoryName = req.body.categoryName
            // Save the category data
            await categoryData.save()
            categoryLogger.log('info', 'Category edited!')
            res.status(200).send({
                success: true,
                message: "Category edited!"
            })
        } else {
            // if category id is wrong 
            res.status(400).send({
                success: false,
                message: "Category not Found"
            })
        }
    } catch (error) {
        categoryLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message,
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        // Takeing Category id form params
        const { categoryId } = req.params
        // takeing the category data form database if it present and delete
        const categoryData = await categoryModel.findByIdAndDelete(categoryId)
        categoryLogger.log('info', 'Category deleted')
        res.status(200).send({
            success: true,
            message: "Category deleted!"
        })
    } catch (error) {
        categoryLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message,
        })
    }
}

const allCategory = async (req, res) => {
    try {
        // Takeing all category data present in data base and show only category name and id
        const categoryData = await categoryModel.find({}).select('categoryName')
        categoryLogger.log('info', 'All category')
        res.status(200).send({
            success: true,
            message: "All category",
            category: categoryData,
        })
    } catch (error) {
        categoryLogger.log('error', `Error: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error!",
            error: error.message,
        })
    }
}

// Exporting api
module.exports = {
    addCategory,
    editCategory,
    deleteCategory,
    allCategory
}
