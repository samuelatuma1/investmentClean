const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    acctHolderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    acctTransactions: {
        type: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Transaction"
        }]
        
    }

}, {
   
    strict: true
});

AccountSchema.methods.getBalance = function (){

}

const Account = mongoose.model("Account", AccountSchema);

module.exports = {Account};

