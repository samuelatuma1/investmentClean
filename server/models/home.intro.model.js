const mongoose /**: Mongoose */ = require("mongoose");

const IntroSchema /**Schema */= new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        minLength: 2
    },
    body: {
        type: String, 
        required: true,
        minLength: 2
    },
    adminWhatsappNum: {
        type: String,
        required: true
    },
    img: {
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
    }
})

const Intro /**Model */ = mongoose.model("Intro", IntroSchema);
module.exports = {Intro};
