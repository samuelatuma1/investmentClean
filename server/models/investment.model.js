const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    yieldValue: {
        type: Number,
        required: true,
        min: 0.00001
    },
    waitPeriod: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: "dollars"
    },
    deleted: {
        type: Boolean,
        default: false
    }, 
    desc: {
        type: String,
        default: ""
    }
});

InvestmentSchema.methods.percentYield = function(){
    return (this.yieldValue / this.amount) * 100;
}

const Investment = mongoose.model("Investment", InvestmentSchema);
module.exports = {Investment};