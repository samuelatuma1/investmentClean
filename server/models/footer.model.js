const mongoose /** Mongoose */ = require("mongoose");

const FooterSchema /** Schema */ = new mongoose.Schema({
    companyName: {
        type: String
    },
    about: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    }
})

const Footer /** Model */ = mongoose.model("Footer", FooterSchema);
module.exports = {Footer};