const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    }

},{
    strict: true,
    timestamps: true
})

const User = mongoose.model("User", UserSchema)

module.exports = {User}