const mongoose /**Mongoose */ = require("mongoose");

const OurServicesImageSchema /**Schema */ = new mongoose.Schema({
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
    ourServicesId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "OurServices",
        required: true
    }
})

const OurServicesImage /**Model */ = mongoose.model("OurServicesImage", OurServicesImageSchema);
module.exports = {OurServicesImage};