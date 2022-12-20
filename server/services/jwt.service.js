const jwt = require("jsonwebtoken")

class IJWTService{
    static signToken(token/*: any */, 
                key /*: string */, 
                expiresIn/*: number */ ) /*:JWToken */{
                    throw new Error("signToken static method not implemented")
                }
    
    static verifyToken = (token /*: JWTToken */, key /*: string */) /*: DecryptedJWTTokenValue  */ => {
        throw new Error("verifyToken static method not implemented")
    }
}
class JWTService /* implements IJWTService */{
   
    static signToken(token, key, expiresIn=(60 * 60* 24 *30)){
        return jwt.sign(token, key, {expiresIn: `${expiresIn}s`})
    }

    static verifyToken = (token, key) => {
        let decryptedData;
        jwt.verify(token, key, (err, verifiedToken) => {
            if(err) throw new Error(err);
            decryptedData =  verifiedToken;
        })
        return decryptedData;
    }
}

module.exports = {JWTService}