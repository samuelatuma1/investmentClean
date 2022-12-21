"use strict"
const {User} = require("../models/auth.model.js")
const {Mail} = require("./mail.service.js")
const crypto = require("crypto")
const {JWTService} = require("./jwt.service.js")
const {ConfigurationSettings} = require("../config.js");

class IAuthService {
    /**
     * @desc hashes User Password, saves user taking {email, password, fullName} from req.body
     * @param req : Request Object
     * @returns {Promise<savedUser>} Object
     * @error Throws error if email already exists
     */
     async saveUser(req){}

      /**
     * @desc Takes in JWTToken, and activates User if jwt is valid
     * @param {JWTToken} token 
     * @returns {Promise<User>}
     */
     verifyEmail = async (token) => {}

     /**
      * 
      * @param {String} email 
      * @param {String} password 
      * @returns {Promise<User>?}
      */
     authenticate = async (email, password) => {}

     /**
     * 
     * @param {object} obj : The matching condition
     * @desc Deletes the first document that matches conditions from db
     */
    deleteOne = async (obj) => {}

    /**
     * uses token, verifies if user is signed in, returns boolean
     * @param {JWTToken} token 
     * @returns {Promise<boolean>}
     */
     userIsSignedIn = async (token) => {}

     /**
     * 
     * @desc checks if a user is admin given a  JWTToken
     * @param {JWTToken} token JWTToken that would be decrypted to figure out if user is admin
     * @returns {Promise<boolean>}
     */
      userIsAdmin = async (token /**: JWTToken */ ) /*: boolean */ => {}

      /**
     * @desc checks if a user is admin given an ObjectId
     * @param {ObjectId} userId The Id of the user
     * @returns {Promise<boolean>}
     */
    verifyIsAdminFromId = async (userId /**: ObjectId */, ) /*: boolean */ => {}

    /**
     * @desc retrieves user with the given id
     * @param {ObjectId} userId 
     * @returns {Promise<User>?}
     */
     retrieveUserById = async (userId) => {}

     /**
     * 
     * @param {ObjectId} _id 
     * @param {string} oldPassword 
     * @param {string} newPassword 
     * @returns {Promise<{passWordChanged: boolean}>}
     */
    changePassword = async (_id /** ObjectId */, oldPassword /** String */, newPassword /** String */) /**{passWordChanged: boolean} */=> {}
}





class AuthService{
    /**
     * @param {{[Key: String]: String | Number}} env
     */
    env;

    constructor(){
        this.env /**  {[Key: String]: String | Number}  */ = ConfigurationSettings.getEnv();

    }
    /**
     * @desc hashes User Password, saves user taking {email, password, fullName} from req.body
     * @param req : Request Object
     *  @returns {Promise<savedUser>} Object
     * @error Throws error if email already exists
     */
    async saveUser(req){
        try{
            const {email, password, fullName} = req.body
            // Hash password
            const hashedPassword = crypto.createHmac("sha256", this.env.HashKey)
                .update(password).digest("hex")

            const newUser = new User({email, fullName,  password: hashedPassword})
            return await newUser.save()
        } catch(err){
            
            throw new Error(err)
        }  
    }
    /**
     * @desc Takes in JWTToken, and activates User if jwt is valid
     * @param {JWTToken} token 
     * @returns {User}
     */
    verifyEmail = async (token) => {
        try {
            // unhash token 
            const _id = JWTService.verifyToken(token, this.env.JWT_KEY)
            // Check whose email matches token
            // Result of _id is hashed as {email: emailAddress}
            const userToVerify = await User.findOne(_id)
            userToVerify.isActive = true
            const savedUser = await userToVerify.save()
            return savedUser

        } catch(err){
            throw new Error(err)
        }
    }

    /**
     * 
     * @param {String} data 
     * @returns {String}
     */
    #hashData = (data /** String */) /** String */ => {
        return crypto.createHmac("sha256", this.env.HashKey)
                .update(data).digest("hex");
    }
    authenticate = async (email, password) => {
        
        // Hash password
        const hashedPassword = this.#hashData(password);
        const user = await User.findOne({email, password: hashedPassword})
        // if user is add token to data
        if(user){
            const token = JWTService.signToken({_id: user._id}, this.env.JWT_KEY)
            user.token = token
        }
        return user
    }
    /**
     * 
     * @param {object} obj : The matching condition
     * @desc Deletes the first document that matches conditions from db
     */
    deleteOne = async (obj) => {
        const deleteCount = await User.deleteOne(obj)
        return deleteCount
    }

    /**
     * 
     * @param {JWTToken} token 
     * @returns {boolean}
     */
    userIsSignedIn = async (token) => {
        try{
            const decryptedToken /*: {_id: ObjectId...} */ = JWTService.verifyToken(token, this.env.JWT_KEY);
        if(!decryptedToken){
            return false;
        }
        return true;
        } catch(err){
            return false;
        }
    }

    /**
     * @param {string} token
     * @returns {boolean}
     */
    userIsAdmin = async (token /**: JWTToken */, ) /*: boolean */ => {
        try{
            const decryptedToken /*: {_id: ObjectId...} */ = JWTService.verifyToken(token, this.env.JWT_KEY);

        if(!decryptedToken){
            return false;
        }

        const {_id} /*: ObjectId */ = decryptedToken;
        const user /*: User */ = await User.findById(_id);
        if(user != null){
            return user.isAdmin;
        }
        return false;
        } catch(err){
            return false;
        }
    }

    /**
     * 
     * @desc checks if a user is admin given a  JWTToken
     * @param {JWTToken} token JWTToken that would be decrypted to figure out if user is admin
     * @returns {boolean}
     */
     userIsAdmin = async (token /**: JWTToken */ ) /*: boolean */ => {
        try{
            const decryptedToken /*: {_id: ObjectId...} */ = JWTService.verifyToken(token, this.env.JWT_KEY);

        if(!decryptedToken){
            return false;
        }

        const {_id} /*: ObjectId */ = decryptedToken;
        const user /*: User */ = await User.findById(_id);
        if(user != null){
            return user.isAdmin;
        }
        return false;
        } catch(err){
            return false;
        }
    }
    /**
     * @desc checks if a user is admin given an ObjectId
     * @param {ObjectId} userId The Id of the user
     * @returns {boolean}
     */
    verifyIsAdminFromId = async (userId /**: ObjectId */, ) /*: boolean */ => {
       
        try{
            const _id /*: ObjectId */ = userId;
            // console.log({_id})
            const user /*: User */ = await User.findById(_id);
            if(user != null){
                return user.isAdmin;
            }
            return false;
        } catch(err){
            return false;
        }
    }

    /**
     * @desc retrieves user with the given id
     * @param {ObjectId} userId 
     */
    retrieveUserById = async (userId) => {
        const user /*: User*/ = await User.findById(userId).select({password: 0});
        

        return user;
    }


    /**
     * 
     * @param {String} email 
     * @returns {Promise<JWTToken>} JWT Representation of _id
     */
    forgotPassword = async (email /** String */) /** String */ => {
        // check if email exists in DB
        const emailExists /** User */= await User.findOne({ email});

        // if email exists. convert email to JWT, expire in 1 hour
        if(emailExists ){
            const expiryTime /** Number */ = 60 * 60 ;
            const encryptedEmail /** String */ = JWTService.signToken({_id: emailExists._id}, this.env.JWT_KEY, expiryTime);

            // return  JWT
            return encryptedEmail;
        }
        return null
    }

    /**
     * 
     * @param {JWTToken} token 
     * @param {{newPassword : String}} param1 
     * @returns {{email: String}}
     */
    updatePassword  = async (token /** JWTToken */, {newPassword /** String */}) => {
        if(newPassword.length < 4) {
            return null;
        }
        const {_id} = JWTService.verifyToken(token, this.env.JWT_KEY);
        if(!_id){
            return null;
        }
        const user /** User */ = await User.findById(_id);
        if(user){
            const hashPassword /** String */= this.#hashData(newPassword);

            const updatedPassword = await User.findByIdAndUpdate(_id, {password: hashPassword});
            return {email: user.email};
        }

        return null;
    }

    /**
     * 
     * @param {ObjectId} _id 
     * @param {string} oldPassword 
     * @param {string} newPassword 
     * @returns {Promise<{passWordChanged: boolean}>}
     */
    changePassword = async (_id /** ObjectId */, oldPassword /** String */, newPassword /** String */) /**{passWordChanged: boolean} */=> {
        // check if old password matches saved Password
        let passwordChanged /** boolean */ = false;
        const user /** User */ = await User.findById(_id);
        if(user !== null){
            // hash oldPassword
            const oldPasswordHash /** String */= this.#hashData(oldPassword);
            const passwordMatches /** boolean */ = user.password === oldPasswordHash;
            if(passwordMatches){
                const hashPassword /** String */= this.#hashData(newPassword);
                const updatedPassword = await User.findByIdAndUpdate(_id, {password: hashPassword});
                passwordChanged = true;
            }
        }

        // else
        return {passwordChanged}; 
    }
}

module.exports = {AuthService, IAuthService}

