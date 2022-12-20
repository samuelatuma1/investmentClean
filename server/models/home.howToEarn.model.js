const mongoose /**Mongoose */ = require("mongoose");

const HowToEarnImageSchema /** Schema */  = new mongoose.Schema({
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
const HowToEarnSchema /**Schema */ = new mongoose.Schema({
    desc: {
        type: String,
        default: "How to start earning"
    },
    steps: [{
        title: String,
        details: String
    }]
})

const HowToEarnImage /** Model */= mongoose.model("HowToEarnImage", HowToEarnImageSchema);
const HowToEarn /**Model */ = mongoose.model("HowToEarnDetails",  HowToEarnSchema);

module.exports = {HowToEarnImage,  HowToEarn}