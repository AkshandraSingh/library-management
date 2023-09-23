const userModel = require('../models/userModel');

const checkUserRole = async (req, res, next, expectedRole) => {
    try {
        const isUserEmailExist = await userModel.findOne({
            userEmail: req.body.userEmail
        });

        if (isUserEmailExist) {
            if (isUserEmailExist.userRole === expectedRole) {
                next();
            } else {
                res.status(400).send({
                    success: false,
                    message: `${expectedRole} is not authorized`,
                });
            }
        } else {
            res.status(401).send({
                success: false,
                message: `${expectedRole} not found`
            });
        }
    } catch (error) {
        console.error(`Error in ${expectedRole} middleware:`, error.message);
        res.status(500).send("Internal server error");
    }
};

const isUser = async (req, res, next) => {
    checkUserRole(req, res, next, 'user');
};

const isAdmin = async (req, res, next) => {
    checkUserRole(req, res, next, 'admin');
};

module.exports = {
    isUser,
    isAdmin,
};
