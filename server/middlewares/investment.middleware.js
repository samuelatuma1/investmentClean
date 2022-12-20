const {check, body} = require("express-validator");

const investmentValidator = [
    check("amount").isNumeric().custom((value, {req}) => {
        if(value <= 0){
            throw new Error("Amount cannot be negative");
        }
        return true;
    }).withMessage(
        "Each investment must have an amount that is numeric"),
    check("yieldValue").isNumeric().custom((value, {req}) => {
            if(value <= 0){
                throw new Error("Yield cannot be negative");
            }
            return true;
        }).withMessage(
            "Each investment must have a yield that is numeric"),
    
    check("waitPeriod").isNumeric().custom((value, {req}) => {
                if(value <= 0){
                    throw new Error("Waiting period is time and cannot be negative");
                }
                return true;
            }).withMessage(
                "Waiting period is time and cannot be negative")
]


const investmentUpdateValidator = [
    check("amount").if(body("amount").exists()).isNumeric().custom((value, {req}) => {
        if(value <= 0){
            throw new Error("Amount cannot be negative");
        }
        return true;
    }).withMessage(
        "Each investment must have an amount that is numeric"),

    check("yieldValue").if(body("yieldValue").exists()).isNumeric().custom((value, {req}) => {
            if(value <= 0){
                throw new Error("Yield cannot be negative");
            }
            return true;
        }).withMessage(
            "Each investment must have a yield that is numeric"),
    
    check("waitPeriod").if(body("waitPeriod").exists()).isNumeric().custom((value, {req}) => {
                if(value <= 0){
                    throw new Error("Waiting period is time and cannot be negative");
                }
                return true;
            }).withMessage(
                "Waiting period is time and cannot be negative")
]

module.exports = {investmentValidator, investmentUpdateValidator};