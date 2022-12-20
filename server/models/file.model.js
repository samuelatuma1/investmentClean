const mongoose /**Mongoose */ = require("mongoose");

const FileSchema /**Schema */ = new mongoose.Schema({
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

    }
})

const File /**Model */ = mongoose.model("File", FileSchema);
module.exports = {File}