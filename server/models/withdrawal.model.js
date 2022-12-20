const mongoose = require("mongoose");

const WithdrawalSchema /**MongooseSchema */ = new mongoose.Schema({
    acctId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Account"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: "dollar"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    viewed: {
        type: String,
        enum: ["seen", "not seen"],
        default: "not seen"
    }
}, {
    timestamps: true,
    strict: true
});

const Withdrawal = mongoose.model("Withdrawal", WithdrawalSchema);

module.exports = {Withdrawal};