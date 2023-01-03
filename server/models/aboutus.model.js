const mongoose /** Mongoose */= require("mongoose");

const AboutUsSchema /** Schema */ = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

const AboutUs /** Model */ = mongoose.model("AboutUs", AboutUsSchema);

module.exports = {AboutUs};