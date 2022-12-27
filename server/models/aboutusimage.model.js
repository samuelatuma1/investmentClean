const mongoose /**Mongoose */ = require("mongoose");

const AboutUsImageSchema /**Schema */ = new mongoose.Schema({
    fieldname: {
        type: String,
    },
    mimetype: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
    },
    aboutUsId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    }
})

const AboutUsImage /**Model */ = mongoose.model("AboutUsImage", AboutUsImageSchema);
module.exports = {AboutUsImage};