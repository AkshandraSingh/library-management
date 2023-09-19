const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../../models/userModel')
const transporter = require('../../services/emailService')

const signupUser = async (req, res) => {
    try {
        const userData = new userModel(req.body);
        // Checking is user email is exist in database already
        const userExistEmail = await userModel.findOne({
            userEmail: req.body.userEmail
        })
        // Checking is user phone number is exist in database already
        const userExistPhone = await userModel.findOne({
            userPhone: req.body.userPhone
        })
        if (!userExistEmail && !userExistPhone) {
            // Bcrypt the user password 
            const bcryptPassword = await bcrypt.hash(req.body.userPassword, 10)
            userData.userPassword = bcryptPassword
            // adding blank profile pic path to user Profile
            userData.userProfilePic = "D:/My Space/Node Projects/library-management/uploads/avatar/blankAvatar"
            // adding user password to used password array
            userData.usedPassword.push(userData.userPassword)
            // save the user information  
            await userData.save()
            res.status(201).send({
                success: true,
                message: "User created successfully"
            })
        } else {
            // if user email or user phone number already exist in database 
            res.status(400).send({
                success: false,
                message: "User email or phone is already in use!",
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error occur",
            error: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body
        const userData = await userModel.findOne({ // Takeing user present data
            userEmail: userEmail
        })
        const isPasswordCorrect = await bcrypt.compare(userPassword, userData.userPassword) // compare the userPassword from actual password
        if (isPasswordCorrect) {
            const token = await jwt.sign({ userData }, process.env.SECRET_KEY, { expiresIn: '1h' }) // generating token
            return res.status(200).send({
                success: true,
                message: "User login success!",
                token: token,
            })
        }
        // if user password is incorrect
        res.status(401).send({
            success: false,
            message: "User password or email is incorrect!"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error occur",
            error: error.message
        })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { userEmail } = req.body
        const userData = await userModel.findOne({ // takeing user data for database
            userEmail: userEmail
        })
        if (userData) {
            const userId = userData._id
            const token = await jwt.sign({ userData }, process.env.SECRET_KEY, { expiresIn: '1h' }) //  generating token
            const link = `https://www.onlineLibrary.com/resetPassword/${userId}/${token}` // Link will given by frontend dev
            await transporter.sendMail({ // sending mail
                to: process.env.USER_EMAIL,
                from: userData.userEmail,
                subject: "Reset Password",
                html: `<a href=${link}>Link for reset Password</a>`
            })
            res.status(200).send({
                success: true,
                message: "We just send you a mail!",
                userId: userId,
                token: token,
            })
        } else {
            // if user email is not present in database
            res.status(400).send({
                success: false,
                message: "User not found!"
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error occur",
            error: error.message
        })
    }
}

module.exports = {
    signupUser,
    loginUser,
    forgetPassword,
}
