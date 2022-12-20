const mongoose /** Mongoose */ = require("mongoose");

const ReviewSchema /**Schema */ = new mongoose.Schema({
    reviews: [
        {
            imageUrl: {
                type: String,
                required: true
            },
            country: {
                type: String,
                default: "United States"
            },
            name: {
                type: String,
                required: true
            },
            gender: {
                type: String,
                enum: ["male", "female"],
                default: "male"
            },
            rating: {
                type: Number,
                default: 5
            }, 
            review: {
                type: String,
                required: true
            }
        }
    ]
});


const Review /**Model */ = mongoose.model("Review", ReviewSchema);
module.exports = {Review};