const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    acctId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Account"
    }, 
    amount: {
        // Can be negative to denote debit(withdrawal).
        type: Number,
        required: true
    },
    investmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Investment"
    },
    currency: {
        type: "string",
        required: true,
        default: "dollar"
    },
    status: {
        type: "string",
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    desc: {
        type: String,
        default: "No description"
    }
}, {
    timestamps: true,
    strict: true
})

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = {Transaction};