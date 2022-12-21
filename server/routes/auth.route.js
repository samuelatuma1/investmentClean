const express = require("express")
const authRoute = express.Router()
const {ValidateToken} = require("../middlewares/token.middleware.js");
// Import controller
const {Auth} =require("../controllers/auth.controller.js")
// import middlewares
const {signUpValidator} = require("../middlewares/auth.middleware.js")

// services
const {AuthService} = require("../services/auth.service.js")
const {Mail} = require("../services/mail.service.js");
const {AccountService} = require("../services/account.service.js");
const { app } = require("../index.js")


const mailServiceProvider = process.env.service
const email_username = process.env.email_username
const email_password = process.env.email_password
// console.log({email_password})
const auth = new Auth(
        new AuthService(), 
        new Mail(mailServiceProvider, email_username, email_password),
        new AccountService()
    );

authRoute.route("/signup")
    .post(signUpValidator, auth.signup);

authRoute.route("/verifymail/:signedToken")
    .get(auth.verifyMail);
    
authRoute.route("/signin")
    .post(auth.signin);

authRoute.route("/userIsSignedIn/:token")
    .get(auth.userIsSignedIn);

authRoute.route("/userIsAdmin/:token")
    .get(auth.userIsAdmin);

authRoute.route("/forgotpassword")
    .post(auth.forgotPassword)

authRoute.route("/updatepassword/:token")
    .put(auth.updatePassword)

authRoute.route("/changepassword")
    .put(ValidateToken.validateToken, auth.changePassword)
module.exports = {authRoute}
