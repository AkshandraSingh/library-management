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
            userData.usedPasswords.push(userData.userPassword)
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

const resetPassword = async (req, res) => {
    try {
        // Taking userId and token form params
        const { userId, token } = req.params
        // Takeing newPassword and Confirm password from body
        const { newPassword, confirmPassword } = req.body
        let isPasswordExist = false
        // User data form database
        const userData = await userModel.findById(userId)
        // checking is user data is exist 
        if (userData) {
            const isTokenCorrect = jwt.verify(token, process.env.SECRET_KEY);
            // checking is token is correct or not 
            if (isTokenCorrect) {
                // checking is new password and confirm password match
                if (newPassword === confirmPassword) {
                    // using loop check is user already use this password in past or not
                    for (const oldPassword of userData.usedPasswords) {
                        if (await bcrypt.compare(newPassword, oldPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    // if user not use new password in past
                    if (!isPasswordExist) {
                        // bcrypt the password
                        const bcryptPassword = await bcrypt.hash(newPassword, 10)
                        // change userPassword to bcryptPassword
                        userData.userPassword = bcryptPassword;
                        // adding bcrypt password to usedPassword array
                        userData.usedPasswords.push(bcryptPassword)
                        await userData.save()
                        res.status(200).send({
                            success: true,
                            message: "Your password is updated!",
                        })
                    } else {
                        // if user already use their password in past
                        res.status(401).send({
                            success: false,
                            message: "Your already use this password at past",
                        })
                    }
                } else {
                    // if new password and confirm password not match
                    res.status(400).send({
                        success: false,
                        message: "New password not match with confirm password",
                    })
                }
            } else {
                // if token was incorrect or expire
                res.status(400).send({
                    success: false,
                    message: "Token is incorrect or expire",
                })
            }
        } else {
            // if user id is incorrect
            res.status(401).send({
                success: false,
                message: "User not found!",
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

const setNewPassword = async (req, res) => {
    try {
        // Takeing user id form params
        const { userId } = req.params
        // Takeing old,new and confirm password form body
        const { oldPassword, newPassword, confirmPassword } = req.body
        let isPasswordExist = false
        // User data form database
        const userData = await userModel.findById(userId)
        // checking is user data is exist 
        if (userData) {
            // compare the oldPassword form userPassword that present in dataBase
            const isPasswordCorrect = await bcrypt.compare(oldPassword, userData.userPassword)
            if (isPasswordCorrect) { // if your old Password is correct
                // checking is new password and confirm password match
                if (newPassword === confirmPassword) {
                    // using loop check is user already use this password in past or not
                    for (const oldPassword of userData.usedPasswords) {
                        if (await bcrypt.compare(newPassword, oldPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    // if user not use new password in past
                    if (!isPasswordExist) {
                        // bcrypt the password
                        const bcryptPassword = await bcrypt.hash(newPassword, 10)
                        // change userPassword to bcryptPassword
                        userData.userPassword = bcryptPassword;
                        // adding bcrypt password to usedPassword array
                        userData.usedPasswords.push(bcryptPassword)
                        await userData.save()
                        res.status(200).send({
                            success: true,
                            message: "Your password is updated!",
                        })
                    } else {
                        // if user already use their password in past
                        res.status(401).send({
                            success: false,
                            message: "Your already use this password at past",
                        })
                    }
                } else {
                    // if new password and confirm password not match
                    res.status(400).send({
                        success: false,
                        message: "New password not match with confirm password",
                    })
                }
            } else {
                // if user enter wrong old password
                res.status(400).send({
                    success: false,
                    message: "Old password is incorrect"
                })
            }
        } else {
            // if user id is incorrect
            res.status(401).send({
                success: false,
                message: "User not found!",
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
// Exporting api
module.exports = {
    signupUser,
    loginUser,
    forgetPassword,
    resetPassword,
    setNewPassword,
}
