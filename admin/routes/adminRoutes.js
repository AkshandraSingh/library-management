const express = require('express')

const adminController = require('../controllers/adminController')
const userController = require('../../user/controllers/userController')
const authService = require('../../middlewares/authService')
const userAuthentication = require('../../middlewares/authToken')

const adminRoutes = express.Router()

adminRoutes.post('/adminLogin', authService.isAdmin, userController.loginUser)
adminRoutes.get('/adminDashBoard', userAuthentication, adminController.adminDashBoard)
adminRoutes.get('/viewUsers', userAuthentication, adminController.viewUsers)
adminRoutes.get('/userDetails/:userId', userAuthentication, adminController.userDetails)
adminRoutes.get('/borrowBooksList', userAuthentication, adminController.borrowBooksList)

module.exports = adminRoutes
