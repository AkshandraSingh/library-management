const bcrypt = require('bcrypt')

const userModel = require('../../models/userModel')

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

module.exports = {
    signupUser,
}
