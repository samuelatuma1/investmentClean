const {check} = require("express-validator");

const transactionValidator = [
    // check("amount").isNumeric()
        // .withMessage("Each transaction must have an amount that is numeric"),
    check("investmentId").isLength({min: 1})
        .withMessage("Each transaction must be associated with an object Id")
]

module.exports = {transactionValidator};

