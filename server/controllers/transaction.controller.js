const {validationResult} = require("express-validator");
const {IInvestmentService} = require("../services/investment.service");
const {IMailService } = require("../services/mail.service");
const {IAccountService} = require("../services/account.service");
const {ITransactionService} = require("../services/transaction.service");

// Route /transaction
class TransactionController{
    /*private readonly */transactionService;
    /*private readonly */accountService;
    /*private readonly */investmentService;
    /*private readonly */ authService;
    /*private readonly */ mailService

    /**
     * @param {IAccountService} accountService 
     * @param {ITransactionService} transactionService 
     * @param {IInvestmentService} investmentService 
     * @param {IMailService} mailService
     */
    constructor(accountService /*: IAccountService */, transactionService /*: ITransactionService */,
    investmentService /*: IInvestmentService */,
    authService /**IUserService */,
    mailService /**IMailService */
    ){
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.investmentService = investmentService;
        this.authService = authService;
        this.mailService = mailService

    }
    
    /** 
     * @method Post /create
     * @protected (userId in req.userId)
     * @payload {
        * amount: number,
        * status: enum {pending, approved, rejected} default pending
        * currency: string default dollar
        * desc: string default No description,
        * investmentId: ObjectId
     * }
     * @params {}, @query {}
     * @returns {transaction: TransactionObject}
    */
    createTransaction = async (req/*: Request */, res /*:Response */) => {
        try{
            const formErrors = validationResult(req).errors;
            if(formErrors.length > 0)
                return res.status(200).json({formErrors});

            const userId /*: ObjectId */= req.userId
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);
        
            if(userAcct !== null){
                const acctId /*:ObjectId */ = userAcct._id;
                
                const transactionObject /*: TransactionDTO */ = req.body;

                // Get investmentId and verify it exists
                const investment /*InvestmentModel?*/ = await this.investmentService.retrieveInvestment(transactionObject.investmentId);
               
                if (investment === null){
                    return res.status(403).json({error: "InvestmentId does not exist"});
                }

                // Get currency
                const currency /**: string */ = investment.currency;
                transactionObject.currency = currency;
                // add amount to transactionoBJECT
                const newTransaction /*: TransactionModel */ = await this.transactionService
                                .createTransaction(acctId, transactionObject);
                return res.status(201).json(newTransaction);
            }
            return res.status(403).json({error: "Transaction Error: No Account for user"});
        } 
        catch(err) {
            // console.log(err)
            return res.status(500).json({error: err.message})
        }
    }
    /**
     *  @method POST /adminaddtransaction
     *  @desc Allows only add transaction
     *  @protected (userId in req.userId | admin access required)
     * 
     *  @param {
     * body {
     *   amount: Number,
     *   userId: String,
     *   currency: Number
     * }} req,
    *  @param {{status: Stats}} res, 
    * @returns {Response<>}
    */
    adminAddTransaction = async (req/*: Request */, res /*:Response */) => {
        try{

             // Ensure user is admin
           const adminId /**ObjectId */ = req.userId;
           const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(adminId);
           // console.log({isAdmin});
           if(!isAdmin)
               return res.status(403).json({message: "You are not permitted to upload "});

            let {amount, userId, currency} = req.body /*: Object<string, object> */;
            const defaultInvestment /** Investment */ = await this.investmentService.getOrCreateDefaultInvestment(currency);

            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);
            const transactionObject /** Transaction */ = {
                amount,
                status: "approved",
                currency,
                investmentId: defaultInvestment._id
            }
            if(userAcct !== null){
                const acctId /*:ObjectId */ = userAcct._id;
                
                // Get investmentId and verify it exists
                const investment /*InvestmentModel?*/ = await this.investmentService.retrieveInvestment(defaultInvestment._id);
            
                if (investment === null){
                    return res.status(403).json({error: "InvestmentId does not exist"});
                }

                // Get currency
                const currency /**: string */ = investment.currency;
                transactionObject.currency = currency;
                // add amount to transactionoBJECT
                const newTransaction /*: TransactionModel */ = await this.transactionService
                                .createTransaction(acctId, transactionObject);
                return res.status(201).json(newTransaction);
             }
        }
        catch(err) {
                // console.log(err)
                return res.status(500).json({error: err.message})
            }

    }
    /** 
     * @method get /gettransactions
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {acctTransactions: List<Transaction>}
    */
    getUserTransactions = async (req /*:Request */, res /*: Response */) => {
        try{
            
            const userId /*: ObjectId */= req.userId
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);
            const defaultTransactionSignature = "default_"
            if(userAcct !== null){
                const acctId /*:ObjectId */ = userAcct._id;
                let acctTransactions /*: List<Transaction> */ = await this.transactionService.getUserTransactions(acctId);

                // remove default transactions
                acctTransactions = acctTransactions.filter(transaction => !transaction.investmentId.desc.includes(defaultTransactionSignature));
                return res.status(200).json({acctTransactions});
            }
        } catch(err){
            // console.log(err.message);
            return res.status(500).json({error: err.message});
        }
    }


    /** 
     * @desc Allows only admin update transactions
     * @method patch /update/:transactionId
     * @protected (userId in req.userId)
     * @payload { 
     *  transaction: {
     *          status: enum {pending, approved, rejected},
     *          ...        
     *      },
     *  email: {
     *          email: email,
     *          subject: string,
     *          body: string
     *  }
     * }
     * @params {}, @query {}
     * @returns {updated: boolean}
    */
    updateUserTransaction = async (req /**Request */, res /**: Response */) => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const params /**: Object<string, string> */ = req.params;
            const transactionId /**:ObjectId */ = params.transactionId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);

            if(!isAdmin){
                return res.status(403).json({message: "You are not permitted to modify transaction"});
            }

            const updateData /**: Object<string, string> */ = req.body.transaction;

            // Send email
            const  {to /**string */, subject /**string */, html /**string */} = req.body.mail;
            if(!to || !subject || !html){
                // console.log("Some params missing");
                return res.status(400).json({updated: false});
            }
            this.mailService.sendMail(to, subject, html);

            
            const transactionUpdated /**: boolean */= await this.transactionService.updateUserTransaction(transactionId, updateData);
            if(transactionUpdated){
                return res.status(200).json({updated: transactionUpdated});
            }
            return res.status(400).json({updated: transactionUpdated})
            
        }
        catch(err /**:Exception */){
            // console.log(err)
            return res.status(500).json({error: err.message})
        }

    }

    /** 
     * @method get /filtertransactions 
     * @desc Allows only admin retrieve transactions
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query { status?: String, ...}
     * @returns {updated: boolean}
    */
    retrieveTransactions = async (req /**Request */, res /**: Response */) => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to retrieve transactions"});

            const query /**: TransactionModelPatch */ = req.query;
            const transactionRes /**List<TransactionModel> */= await this.transactionService.retrieveTransactions(query);

            // Transform transactionsRes to transaction with user details
            const transactions /**List<TransactionModel> */= [];

            for(let transaction /**TransactionModel */  of transactionRes){
                const transactionObject /**TransactionModel */ = transaction.toObject();
                const userId/**ObjectId */ = transactionObject.acctId.acctHolderId;
                const user /** User */ = await this.authService.retrieveUserById(userId);
                if(user !== null){
                    transactionObject['user'] = user.toObject();
                    transactions.push(transactionObject);
                }
            }
            
            return res.status(200).json(transactions);


        } catch(err /**Exception */){
            // console.log(err)
            return res.status(500).json({error: err.message})
        }
    }

}

module.exports = {TransactionController};