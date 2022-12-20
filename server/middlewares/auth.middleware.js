const {check, body} = require("express-validator")

const signUpValidator = [
    // check("mail").if((body('mail').exists())).trim()
    check("fullName").trim().isLength({min: 1}),
    check("email").isEmail().withMessage("Please input a valid email"),
    check("password").isLength({min: 6}).withMessage("Password must be more than five characters long"),
    check("retypePassword").custom((val, {req}) => {
        if(req.body.password !== val){
            throw new Error("Passwords must match")
        }
        return val
    }).withMessage("Passwords must match")
]



module.exports = {signUpValidator}