const express = require('express')

const adminController = require('../controllers/adminController')
const userController = require('../../user/controllers/userController')
const authService = require('../../middlewares/authService')
const userAuthentication = require('../../middlewares/authToken')

const adminRoutes = express.Router()

adminRoutes.post('/adminLogin', authService.isAdmin, userController.loginUser)
adminRoutes.get('/adminDashBoard', userAuthentication, adminController.adminDashBoard)

module.exports = adminRoutes
