const {Account} = require("../models/account.model.js");
class IAccountService{
    /**
     * Creates account for user with userId
     * @param {ObjectId(User)} userId
     * Creates an account for user  
     */
    createAccount = async (userId /*: ObjectId */) /*:Promise<savedAcct> */ => { 
        throw new Error("createAccount not implemented")}

    /**
     * Retrieves all accounts by signed In user
     */
     retrieveAccounts = async (userId /*: ObjectId */) /**: Promise<Array<Account>> */ => {
        throw new Error("retrieveAccounts not implemented")
     };

     /**
      * Retrieve first account for user
      */
      retrieveAccount = async (userId /*: ObjectId */) /**Promise<Account> */ => {
        throw new Error("retrieveAccount not implemented")
      }

      getAccountById = async ( acctId /*: ObjectId */ ) /*: Promise<Account>  */ => {
        throw new Error("getAccountById not implemented");
      }

    /**
     * Deletes account for user
     */
     deleteAccount = async (userId /*: ObjectId */, acctId /*: ObjectId */) /* void */=> {
        throw new Error("deleteAccount not implemented");
     }
};

class AccountService /* implements IAccountService */ {
    createAccount =async (userId /*: ObjectId */) => {
        if(userId != null){
            const userAcctExists = await Account.findOne({"acctHolderId" : userId});
            if(userAcctExists != null){
                throw new Error("Account exists for user");
            }
            const newAccount /*: Account */= new Account({
                acctHolderId: userId,
            });
            // Check if an account already exists for user;
            
            const savedAcct = await newAccount.save();
            return savedAcct;
        }
        else{
            throw new Error("Invalid User id")
        }
    }

    

    getAccountById = async ( acctId /*: ObjectId */ ) => {
        try{
            return Account.where({_id: acctId});
        } catch(err){
            return null;
        }
    }

    retrieveAccounts = async (userId /*: ObjectId */)  /*: List<Account> */ => {
        const userAccts /*: List<Account> */ = await Account.where({acctHolderId: userId});
        return userAccts;
    }

    retrieveAccount = async (userId /*: ObjectId */) /*: Promise<Account> */ => {
        const userAcct /* Promise<Account> */ = await Account.findOne({acctHolderId: userId});
        return userAcct;
    }

    deleteAccount = async (userId /*: ObjectId */, acctId /*: ObjectId */) /* void */=> {
        try{
            await Account.deleteOne({_id: acctId, acctHolderId: userId});
        }
        catch (err){
            throw new Error(err)
        }

    }
}

module.exports = {AccountService, IAccountService}