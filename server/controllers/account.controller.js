"use strict"
const {validationResult} = require("express-validator")

class AccountController {
    constructor(accountService /*: IAccountService */, transactionService /*: ITransactionService */){
        this.accountService = accountService;
        this.transactionService = transactionService;
    }
    /** 
     * @method POST /account/createacct
     * @protected (userId in req,userId)
     * @payload {}
     * @params {}, @query {}
     * @returns Account
    */
    createAccount =async (req /*: Request */, res/*: Response */) => {
        try{
            // Get user id 
            const userId /*: ObjectId */ = req.userId
            const newUserAcct /*: Account */ = await this.accountService
                                .createAccount(userId);
            return res.status(201).json(newUserAcct);
        }
        catch (err){
            const errMsg = err.message
            // console.log(err);
            return res.status(500).json({"error": errMsg});
        }
    }
    /** 
     * @method Get /account/geteaccts
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {userAccts: Account[]}
    */
    getAccounts = async (req /**: Request */, res /**: Response */) => {
        try{
            const userId = req.userId;
            const userAccts = await this.accountService.retrieveAccounts(userId);
            return res.status(200).json({userAccts});
        } catch(err){
            const error =  err.message;
            // console.log(err)
            return res.status(500).json({error});
        }
    }
    /** 
     * @desc Retrieves the first user account it finds
     * @method Get /account/geteacct
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {userAcct: Account}
    */
     getAccount = async (req /**: Request */, res /**: Response */) => {
        try{
            const userId = req.userId;
            const userAcct = await this.accountService.retrieveAccount(userId);
            return res.status(200).json({userAcct});
        } catch(err){
            const error =  err.message;
            // console.log(err);
            return res.status(500).json({error});
        }
    }

    /** 
     * @desc Deletes account for user
     * @method DELETE /account/deleteeacct/acctId
     * @protected (userId in req.userId)
     * @payload {}
     * @params {acctId: ObjectId}, @query {}
     * @returns {message: string}
    */
    deleteAccount = async (req /*: Request */, res /*: Response */)  => {
        try{
            const acctId /*: ObjectId */ = req.params.acctId;
            const userId = req.userId;

            await this.accountService.deleteAccount(userId, acctId)
            return res.status(200).json({"message": `Account with id 
                            ${acctId} owned by user with id ${userId} deleted`});

        } catch(err){
            const error = err.message;
            // console.log(err);
            return res.status(500).json({error});
        }
    }


    

    /** 
     * @desc Creates a Transaction for an Account
     * @method Post /account/createtransaction/:acctId
     * @protected (userId in req.userId)
     * @payload {amount: number; desc: string}
     * @params {acctId: ObjectId}, @query {}
     * @returns {message: string}
    */
    createTransaction = async (req /*: Request */, res /*: Response */) => {
        try{
            const acctId /*: ObjectId */ = req.params.acctId;
            const {amount, desc} = req.body;
            if(amount == null || undefined){
                return res.status(403).json({'message': 'Please add a valid transaction amount'})
            }

            const newTransaction /*: Transaction */ = await this.transactionService
                                    .createTransaction(acctId, {amount, desc})
            return res.status(201).json(newTransaction);
        } catch(err){
            const error = err.message;
            // console.log(err);
            return res.status(500).json({error});
        }
    }
}

module.exports = {AccountController};