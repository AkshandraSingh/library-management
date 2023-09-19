const userModel = require('../models/userModel')

const isUser = async (req, res, next) => {
    try {
        const isUserEmailExist = await userModel.findOne({
            userEmail: req.body.userEmail
        })
        if (isUserEmailExist) {
            if (isUserEmailExist.userRole === "user") {
                next()
            } else {
                res.status(400).send({
                    success: false,
                    message: "User is not auth",
                })
            }
        } else {
            res.status(401).send({
                success: false,
                message: "User not found"
            })
        }
    } catch (error) {
        console.error("Error in isUser middleware:", error.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    isUser,
}