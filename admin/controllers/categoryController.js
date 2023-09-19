const categoryModel = require('../../models/categoryModel')

const addCategory = async (req, res) => {
    try {
        // Creating a new instance of category data
        const categoryData = new categoryModel(req.body)
        // Save the category data
        await categoryData.save()
        res.status(201).send({
            success: true,
            message: "Category created!",
        })
    } catch (error) {
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
        res.status(200).send({
            success: true,
            message: "Category deleted!"
        })
    } catch (error) {
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
        res.status(200).send({
            success: true,
            message: "All category",
            category: categoryData,
        })
    } catch (error) {
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
