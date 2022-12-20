"use strict"
const {validationResult} = require("express-validator");
const { IMailService } = require("../services/mail.service");

class IAuth {
    
}
class Auth{
    /**
     * 
     * @param {AuthService} authService 
     * @param {IMailService} mailService
     */
    constructor(authService, mailService, accountService){
        this.authService = authService;
        this.mailService = mailService;
        this.accountService = accountService;
    }

    /**
     * @desc Signs up a user creates account(Transaction account) for user in the process
     * @METHOD POST /auth/signup
     * @param req {<
     *              reqParams={},
     *              resBody={},
     *              reqBody={
     *                  fullName: string,
     *                  email: email(String), password: string
     *                  retypePassword: string
     * }
     *  >}
     */
    signup = async (req, res) => {
        try{
            const formErrors = validationResult(req).errors
            if(formErrors.length > 0){
                return res.status(200).json({formErrors})
            }
            // console.log("res.body", req.body)
            const savedUser = await this.authService.saveUser(req)

            //  Create account for user in the process of creating user
            const _id = savedUser._id;
            const userTransactionAcct = await this.accountService.createAccount(_id);
            // console.log({userTransactionAcct});

            // Send Verification Mail
            let verificationMail;
            try{
                verificationMail = await this.mailService.sendVerificationMail(req, savedUser)
            } catch(err){
                const removedMail = await this.authService.deleteOne({email: req.body.email})
                    // console.log({removedMail})
                    return res.sendStatus(400)
            }
            
            res.status(201).json({savedUser: savedUser.toObject()})
        } catch(err){
            // console.log(err)
            return res.status(403).json({error: "user with email already exists"})
        }
    }

    /**
     * @desc verifies mail, creates account(Transaction account) for user in the process
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    verifyMail = async (req, res) => {
        try{
            // Get signed token
            const token = req.params.signedToken
            const validatedUser = await this.authService.verifyEmail(token)

            

            // return res.status(200).json({validatedUser})
            return res.redirect("/auth/signin") 
        } catch(err){
            // console.log(err)
            return res.status(403).json({error: "Token invalid or does not exist"})
        }
    }

     /**
     * @desc Signs up a user
     * @METHOD POST /auth/signin
     * @param req {<
     *              reqParams={},
     *              resBody={},
     *              reqBody={
     *                  email: email(String),       
     *                  password: string
     * }
     *  >}
     */
    signin = async (req, res) => {
        try{
            const {email, password} = req.body
            if(!email || !password){
                return res.status(400).json({"error": "Please input email and password"})
            }
            const user = await this.authService.authenticate(email, password)
            if(!user){
                return res.status(400).json({"error": "username or password invalid"})
            }
            // console.log(user)
            if(!user.isActive){
                return res.status(403).json({error: "account not activated"})
            }
            // User is valid, with signed token in key -> token
            res.cookie("token", user.token)
            // console.log("cookies", req.cookies)
            const {_id /*: BsonObject */, fullName /*: String */} = user
            return res.status(200).json({email, _id, fullName, token: user.token})
        } catch(err){
            // console.log(err)
            return res.status(400).json({error: "Authentication failed"})
        } 
    }
    /**
     * @desc checks if a user is signed in using token 
     * @METHOD GET /auth//userIsSignedIn/:token
     * @param req {
     *              reqParams={},
     *              resBody={},
     *              reqBody={}
     }

     */
    userIsSignedIn = async (req /*: Request */, res /*: Response */) /*: json({isSignedIn: boolean}) */ => {
        try{
            const token /*: JWTToken */ = req.params.token;
            const isSignedIn /*: boolean */ = await this.authService.userIsSignedIn(token);
            return res.status(200).json({isSignedIn});
        } catch(err){
            // console.log(err.message);
            return res.status(200).json({isSignedIn: false});
        }
    }


    /**
     * @desc checks if a user is admin using token provided in req Params
     * @METHOD GET /auth/userIsAdmin/:token
     * @param req {
     }
     */
     userIsAdmin = async (req /*: Request */, res /*: Response */) /*: json({isAdmin: boolean}) */ => {
        try{
            const token /*: JWTToken */ = req.params.token;
            const isAdmin /*: boolean */ = await this.authService.userIsAdmin(token);
            return res.status(200).json({isAdmin});
        } catch(err){
            // console.log(err.message);
            return res.status(200).json({isAdmin: false});
        }
    }


    /**
     * @desc sends mail to valid email address to reset password
     * @METHOD POST /auth/forgotpassword
     * @param {body : {email: String}} req 
     * @returns {Response<{sent: boolean}>}
     */
    forgotPassword = async (req /*: Request */, res /*: Response */) /*: Response<{sent: boolean}>*/ => {
        try{
            const {email /** String */} = req.body;
            let sent /** boolean */ = false;
            if(!email){
                return res.status(400).json({error: "Please, include a valid email"})
            }
            const JWT_id /** JWTToken */= await this.authService.forgotPassword(email);
            if(JWT_id !== null){
                const urlPath = "/auth/passwordreset"
                const verificationUrl = req.protocol + '://' + req.get('host') 
                    + urlPath + "/" + JWT_id;

                const divToUpdatePassword /** HTMLElement */ = `
                <div style="font-family: verdana sans-serif;">
                    <h3>Hello </h3>
                    <p>Password Reset</p>

                    <button style="background: teal; color: white; border: 0px solid teal; 
                        border-radius: 5px; padding: 10px;">
                            <a href="${verificationUrl}" style="color: inherit;
                            text-decoration: none;">Update Password</a>
                        </button>
                    <p>Didn't sign up for our mail, Please email us at ...</p>
                </div>
                `
                this.mailService.sendMail(email, "Password reset", divToUpdatePassword);
                sent = true;
                // console.log({verificationUrl});
            }

            return res.status(200).json({sent});
        }
        catch(err /** Exception */){
            // console.log(err.message);
            return res.status(200).json({error: err.message});
        }

    }
    
    
    /**
     * @desc resets password for forgotten password
     * @METHOD PUT /auth/updatepassword/{token}
     * @param {body : {newPassword: String, confirmPassword: String}} req 
     * @returns {Promise<Response<{sent: boolean}>>}
     */
    updatePassword = async (req /*: Request */, res /*: Response */) /*:*/ => {
        try{
            const token /** JWTToken */ = req.params.token;
            const {newPassword /** String */, confirmPassword /** String */} = req.body;

            if(!newPassword || !confirmPassword  || newPassword !== confirmPassword ){
                return res.status(400).json({error: "Passwords (confirmPassword and newPassword) must match,"});
            }
            const updatedPassword = await this.authService.updatePassword(token, {newPassword});
            if(!updatedPassword){
                return res.status(400).json({error: "Password update failed, please, try again"});
            }
            else{
                return res.status(200).json({email: updatedPassword.email});
            }
        } catch(err /** Exception */){
            // console.log(err.message);
            return res.status(200).json({error: err.message});
        }
    }

}

module.exports = {Auth}