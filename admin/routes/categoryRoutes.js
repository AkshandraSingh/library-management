const express = require('express')

const categoryController = require('../controllers/categoryController')

const categoryRouter = express.Router()

categoryRouter.post('/addCategory', categoryController.addCategory)
categoryRouter.post('/editCategory/:categoryId', categoryController.editCategory)
categoryRouter.delete('/deleteCategory/:categoryId', categoryController.deleteCategory)
categoryRouter.get('/allCategory', categoryController.allCategory)

module.exports = categoryRouter
