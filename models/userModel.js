const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userPhone: {
        type: Number,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userAddress: {
        type: String,
        required: true,
    },
    userProfilePic: {
        type: String,
        required: true,
    },
    userGender: {
        type: String,
        required: true,
    },
    borrowBooks: {
        type: [],
        required: [],
    },
    usedPasswords: {
        type: [],
        required: [],
    },
    userRole: {
        type: String,
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

userModel.set('timestamps', true)

module.exports = mongoose.model('user', userModel)
