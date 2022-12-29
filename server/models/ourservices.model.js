const mongoose /** Mongoose */= require("mongoose");

const OurServicesSchema /** Schema */ = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    }
})

const OurServices /** Model */ = mongoose.model("OurServices", OurServicesSchema);

module.exports = {OurServices};