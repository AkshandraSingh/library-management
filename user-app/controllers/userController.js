const bcrypt = require('bcrypt')

const userModel = require('../../models/userModel')

const signupUser = async (req, res) => {
    try {
        const userData = new userModel(req.body);
        const userExistEmail = await userModel.findOne({
            userEmail: req.body.userEmail
        })
        const userExistPhone = await userModel.findOne({
            userPhone: req.body.userPhone
        })
        if (!userExistEmail && !userExistPhone) {
            const bcryptPassword = await bcrypt.hash(req.body.userPassword, 10)
            userData.userPassword = bcryptPassword
            userData.userProfilePic = "D:/My Space/Node Projects/library-management/uploads/avatar/blankAvatar"
            userData.usedPassword.push(userData.userPassword)
            await userData.save()
            res.status(201).send({
                success: true,
                message: "User created successfully"
            })
        } else {
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
