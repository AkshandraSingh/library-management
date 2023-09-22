const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../../models/userModel')
const transporter = require('../../services/emailService')
const userLogger = require('../../utils/userLogger/userLogger')
const bookModel = require('../../models/booksModel')

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
            userLogger.log('info', 'User created successfully')
            res.status(201).send({
                success: true,
                message: "User created successfully"
            })
        } else {
            // if user email or user phone number already exist in database 
            userLogger.log('error', 'User email or phone is already in use!')
            res.status(400).send({
                success: false,
                message: "User email or phone is already in use!",
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
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
            userLogger.log('info', 'User login success!')
            return res.status(200).send({
                success: true,
                message: "User login success!",
                token: token,
            })
        }
        // if user password is incorrect
        userLogger.log('error', 'User password or email is incorrect!')
        res.status(401).send({
            success: false,
            message: "User password or email is incorrect!"
        })
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
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
            userLogger.log('info', 'User got the mail for reset their password')
            res.status(200).send({
                success: true,
                message: "We just send you a mail!",
                userId: userId,
                token: token,
            })
        } else {
            // if user email is not present in database
            userLogger.log('error', `User not found!`)
            res.status(400).send({
                success: false,
                message: "User not found!"
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
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
                        userLogger.log('info', 'User password is updated!')
                        res.status(200).send({
                            success: true,
                            message: "Your password is updated!",
                        })
                    } else {
                        // if user already use their password in past
                        userLogger.log('error', 'User already use this password at past')
                        res.status(401).send({
                            success: false,
                            message: "Your already use this password at past",
                        })
                    }
                } else {
                    // if new password and confirm password not match
                    userLogger.log('error', 'New password not match with confirm password')
                    res.status(400).send({
                        success: false,
                        message: "New password not match with confirm password",
                    })
                }
            } else {
                // if token was incorrect or expire
                userLogger.log('info', 'Token is incorrect or expire')
                res.status(400).send({
                    success: false,
                    message: "Token is incorrect or expire",
                })
            }
        } else {
            // if user id is incorrect
            userLogger.log('error', `User not found!`)
            res.status(401).send({
                success: false,
                message: "User not found!",
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
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
                        userLogger.log('info', 'User password is updated!')
                        res.status(200).send({
                            success: true,
                            message: "Your password is updated!",
                        })
                    } else {
                        // if user already use their password in past
                        userLogger.log('error', 'User already use this password at past')
                        res.status(401).send({
                            success: false,
                            message: "Your already use this password at past",
                        })
                    }
                } else {
                    // if new password and confirm password not match
                    userLogger.log('error', 'New password not match with confirm password')
                    res.status(400).send({
                        success: false,
                        message: "New password not match with confirm password",
                    })
                }
            } else {
                // if user enter wrong old password
                userLogger.log('error', 'User Old password is incorrect')
                res.status(400).send({
                    success: false,
                    message: "Old password is incorrect"
                })
            }
        } else {
            // if user id is incorrect
            userLogger.log('error', `User not found!`)
            res.status(401).send({
                success: false,
                message: "User not found!",
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error occur",
            error: error.message
        })
    }
}

const viewProfile = async (req, res) => {
    try {
        // Takeing userId from params
        const { userId } = req.params
        // Extract user data from database by using userId and show only few Fields
        const userData = await userModel.findById(userId).select('userName userPhone userEmail userAddress userProfilePic borrowBooks');
        if (userData) {
            userLogger.log('info', 'User Profile Showed')
            res.status(200).send({
                success: true,
                message: "Your profile!",
                userProfile: userData,
            })
        } else {
            // if user id is not correct
            userLogger.log('error', 'User not found!')
            res.status(400).send({
                success: false,
                message: "User not found!"
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error occur",
            error: error.message
        })
    }
}

const editProfile = async (req, res) => {
    try {
        // Takeing userId from params
        const { userId } = req.params
        // changing profile pic path
        const userProfilePic = req.file ? `/upload/userProfile/${req.file.filename}` : undefined;
        // updating the user data 
        const userData = await userModel.findByIdAndUpdate(userId, {
            userName: req.body.userName || undefined,
            userPhone: req.body.userPhone || undefined,
            userAddress: req.body.userAddress || undefined,
            userProfilePic: userProfilePic || undefined,
        }, {
            new: true,
        })
        if (userData) {
            userLogger.log('info', 'User profile is edited!')
            res.status(200).send({
                success: true,
                message: "User profile is edited!",
                userProfile: userData,
            })
        } else {
            // if user id is not correct
            userLogger.log('error', 'User not found!')
            res.status(401).send({
                success: false,
                message: "User not found!"
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
        res.status(500).send({
            success: false,
            message: "Error occur",
            error: error.message
        })
    }
}

const borrowBooks = async (req, res) => {
    try {
        // Takeing userId and bookId form params
        const { userId, bookId } = req.params
        // Extracting userData
        const userData = await userModel.findById(userId)
        // Extracting bookData
        const bookData = await bookModel.findById(bookId)
        // Checking is userData and bookData present
        if (userData && bookData) {
            // Checking is user own more than 2 or 2 book at one time
            if (userData.borrowBooks.length >= 2) {
                userLogger.log('error', 'You already owned 2 books,First return!')
                return res.status(401).send({
                    success: false,
                    message: "You already owned 2 books,First return!"
                })
            }
            // checking book status is not equal to available
            if (bookData.bookStatus != "available") {
                userLogger.log('error', 'This book is already by someone')
                return res.status(401).send({
                    success: false,
                    message: "This book is already by someone"
                })
            }
            // Changing data
            bookData.currentOwner = userId
            bookData.bookStatus = "not available"
            userData.borrowBooks.push(bookData.bookName)
            // Saving book data
            await bookData.save();
            // Saving user data
            await userData.save();
            // If user don't own 2 books at time and book is available
            userLogger.log('info', 'User successfully borrow book')
            res.status(200).send({
                success: true,
                message: "You can take your book from nearest our Library",
                greet: "Thanks for visiting 🙏🏻",
            })
        } else {
            // if userId or bookId is not in database
            userLogger.log('error', 'User or Book data not found!')
            res.status(400).send({
                success: false,
                message: "User or Book data not found!"
            })
        }
    } catch (error) {
        userLogger.log('error', `Error occur: ${error.message}`)
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
    viewProfile,
    editProfile,
    borrowBooks,
}
