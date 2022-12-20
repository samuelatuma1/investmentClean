const { IWithdrawalService } = require("../services/withdrawal.service.js");
const { IInvestmentService } = require("../services/investment.service.js");
const { ITransactionService } = require("../services/transaction.service.js");
const { IAccountService } = require("../services/account.service.js");


// [ApiController]
//[Route("/withdrawal")]
class WithdrawalController{
    /** private readonly IWithdrawalService withdrawalService */
    withdrawalService;
    /** private readonly ITransactionService transactionService*/
    transactionService;
    /** private readonly IAccountSerice accountService */
    accountService;

    /** private readonly IAuthSerice accountService */
    authService;

    /**private readonly IMailService mailService  */

    /**
     * 
     * @param {IWithdrawalService} withdrawalService 
     * @param {ITransactionService} transactionService 
     * @param {IAccountService} accountService
     * @param {IAuthService} authService
     * @param {IMailService} mailService
     */
    constructor(withdrawalService /**IWithdrawalService */, 
                transactionService /**ITransactionService */,
                accountService /**IAccountService */,
                authService /**IUserService */,
                mailService /** IMailService*/)
    {

            this.withdrawalService = withdrawalService;
            this.transactionService = transactionService;
            this.accountService = accountService;
            this.authService = authService;
            this.mailService = mailService;
            
    }
    /** 
     * @method POST /withdraw
     * @protected (userId in req.userId)
     * @payload {
     *  amount: number,
     *  currency: string
     * }
     * @params {}, @query {}
     * @returns {acctTransactions: List<Transaction>}
    */
    withdraw = async (req /**Request */, res /**Response */ ) => {
        try{
            // 
            const {amount /**number */, currency = "" /** string */} = req.body;
            if(!amount || (typeof +amount !== "number" || currency.trim() === "")){
                
                return res.status(403).json({error: "Invalid amount or currency"});
            }
            // get all valid successful transactions
            const userId /*: ObjectId */ = req.userId;
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);

            if(userAcct == null){
                // console.log("UserAcct is null")
                return res.status(403).json({error: "No user account for user"})
            }

            const acctId /**ObjectId */ = userAcct._id;
            const {withdrawableTransactions  /**TransactionModel[] */} = await this.transactionService
                        .retrieveWithdrawableTransactions(acctId);
            
            // withdraw
            const withdrawalData /**WithdrawalModel */= {
                acctId, userId, amount, currency
            }
            // console.log({withdrawableTransactions});
            const withdraw /**: WithdrawModel */= await this.withdrawalService.withdraw(withdrawalData, withdrawableTransactions);
            if(withdraw !== null){
                return res.status(201).json({withdrawal: withdraw, created: true});
            }
            return res.status(200).json({created: false});
        } catch(err /**Error */){
            // console.log(err)
            return res.status(500).json({error: err.message})
        }
    }
    
     /** 
     * @method GET /getwithdrawablebalance
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {{
            [key: string]: {
                availableWithdrawableBalance: number,
                pendingWithdrawableBalance: number
            }}
    */
    getWithdrawableAndPendingBalance = async (req /**Request*/, res /**Response */) => {
        try{
            // get all valid successful transactions
            const userId /*: ObjectId */ = req.userId;
            const userAcct /*: AccountModel */ = await this.accountService.retrieveAccount(userId);

            if(userAcct == null){
                return res.status(403).json({error: "No user account for user"})
            }

            const acctId /**ObjectId */ = userAcct._id;
            const {withdrawableTransactions  /**TransactionModel[] */} = await this.transactionService
                        .retrieveWithdrawableTransactions(acctId);
            const getAllWithdrawableAndPendingBalance /**
                {
                [key: string]: {
                    availableWithdrawableBalance: number;
                    pendingWithdrawableBalance: number;
                }
            */ = await this.withdrawalService
                .getAllWithdrawableAndPendingBalance(withdrawableTransactions, acctId);
            return res.status(200).json({withdrawableAndPendingBalance: getAllWithdrawableAndPendingBalance})
        }

        catch(err /**Error */){
            // console.log(err)
            return res.status(500).json({error: err.message})
        }
    }

    /** 
     * @method GET /getwithdrawals
     * @desc Allows only admin retrieve withdrawals
     * @protected (userId in req.userId)
     * @payload {}
     * @params {}, @query {}
     * @returns {Array<Withdrawal> }
    */
    getAllWithdrawals = async (req, res) => {

        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to retrieve withdrawals"});

            
            const allwithdrawals /**Array<Withdrawal> */ = await this.withdrawalService.getAllWithdrawals();
            return res.status(200).json(allwithdrawals);
        } 
        catch (err /**Exception */){
            // console.log(err)
            return res.status(500).json({error: err.message})
        }
    }


    /** 
     * @method PUT /updatewithdrawal/:withdrawalId
     * @desc Allows only admin update withdrawals and optionally send mail
     * @protected (userId in req.userId | admin access required)
     * @payload {
     *  mail: {
     *      to: Email,
     *      subject: String,
     *      html: HTML
     *  },
     * withdrawal: {
     *   status? : enum: ["pending", "approved", "rejected"],
     *   viewed? : enum: ["seen", "not seen"]
     * }
     * }
     * @params {}, @query {}
     * @returns {Withdrawal }
    */
     updateWithdrawal = async (req /**Request */, res /**Response */) /**Query<> */=> {

        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to update withdrawals"});

            // Update withdrawal
            const withdrawalId /**ObjectId */ = req.params.withdrawalId;
            const updatedDTO /**{[Key: String]: String} */ = req.body.withdrawal;
            const withdrawalUpdateResponse /** Withdrawal */ = await this.withdrawalService.updateWithdrawal(withdrawalId ,updatedDTO);
            
            
            // send mail
            const  {to /**string */, subject /**string */, html /**string */} = req.body.mail;
                if(!to || !subject || !html){
                    // console.log("Some params missing");
                    return res.status(400).json({updated: false});
                }
            if (html !== "..."){
                // console.log("mail sent");
                this.mailService.sendMail(to, subject, html);
            }            
            return res.status(200).json(withdrawalUpdateResponse);
        }
        catch(err /**Error */){
            // console.log(err);
            return res.status(500).json({error: err.message});
        }
     }
}

module.exports = {WithdrawalController}