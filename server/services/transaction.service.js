const {Transaction} = require("../models/transaction.model");
const {AccountService} = require("./account.service.js");
const { Utils } =  require("../utils/utils.utils");

const TransactionsSummaryDTO = {
    totalDeposits: Number, 
    totalEarnings: Number, 
    totalProfitFromInvestments: Number,
    transactionCurrency: String, 
    avgROI: Number
}
class ITransactionService {
    /**
     * @desc Creates a new transaction
     */
    createTransaction = async (AccountId/* ObjectId */, transaction /*: TransactionObject */ ) /*: Transaction */=> {}

     /**
     * 
     * @param {ObjectId} acctId : -> account Id
     * @returns {Promise<List<TransactionModel>>} for accountId
     */
      getUserTransactions = async (acctId /*:ObjectId */) /** List<TransactionModel> */=> {}
    
      /**
     * 
     * @param {ObjectId} acctId : -> account Id
     * @param {enum["pending", "approved", "rejected"]} status 
     * @returns {Promise<List<TransactionModel>>} with status matching status
     */
    filterUserTransactionsByStatus = async (acctId /*:ObjectId */, status /*:string */="pending") /**List<TransactionModel> */=> {}

    /**
     * 
     * @param {ObjectId} transactionId 
     * @param {ObjectId} acctId
     * @param {Object} updateData
     */
     updateUserTransaction = async (transactionId /*:ObjectId */,
                            updateData /*: Object */ = {}) /**void */ => {}

    /**
     * 
     * @param {TransactionModelPatch {status?: string, ...}} transactionQuery 
     * @returns {Promise<List<TransactionModel>>}
     */
     retrieveTransactions = async (transactionQuery 
        /**: TransactionModelPatch  */) /**: Array<TransactionModel> */ => {}

     /**
     * 
     * @param {ObjectId} acctId transaction acctId
     * @returns {Promise<{
      *  withdrawableTransactions: Array<TransactionModel>,
      *  withdrawableTransactionsAmount: number
      * }>}
      */
     retrieveWithdrawableTransactions = async (acctId /**ObjectId */) => {}

     /**
     * @desc Summarizes transactions by account
     * @param {ObjectId} acctId 
     * @returns {Promise<{[Key: String]: TransactionsSummaryDTO}>} transaction summary for each currency for account
     */
    userTransactionsSummary = async (acctId /**ObjectId */) /** Object*/ => {}
}

/*
interface TransactionObject {
    amount: number;
    desc: string;
    currency: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    status: enum {pending, approved, rejected}
}
*/
class TransactionService /*: implements ITransactionService */ {
    balanceAfterTransactionPositive = async (AccountId/* ObjectId */, transaction /*: TransactionObject */) => {
        // Verify transaction does not reduce balance to below 0
        const userTransactions /*: List<Transaction> */ = await Transaction.where({acctId: AccountId});
        if(transaction.amount > 0){
            return true;
        }
        const userTransactionsBal /*: number */= userTransactions
        .reduce((transSum /*: number */, currTransaction /*: Transaction */) =>
        transSum + currTransaction.amount, 0);
        
        // console.log({userTransactionsBal})
        const balAfterCurrTransaction /*: number */ = userTransactionsBal + transaction.amount;
        // console.log({balAfterCurrTransaction})
        if(balAfterCurrTransaction <= 0){
            return false;
        }
        return true;
    } 

    /**
     * @desc returns transaction's current (fractional) value 
     * @param {number} daysPassedSinceTransaction => Days passed since transaction was initiated
     * @param {number} waitPeriod => The number of days transaction needs to mature!
     * @returns {number} 1 if fractional value is greater than 1, else the fractional value;
     */
    #transactionCurrentValue = (daysPassedSinceTransaction /**number */,  waitPeriod 
    /**number */) /**number */ => 
            (daysPassedSinceTransaction / waitPeriod) >= 1 ?
                1: (daysPassedSinceTransaction / waitPeriod);
    
    
    createTransaction = async (AccountId/*: ObjectId */, transaction /*: Transaction */ ) => {
        try{
            
            const {amount, desc, status, currency, investmentId} = transaction /*: Object<string, object> */;
            
            const newTransaction = new Transaction({ acctId: AccountId, amount, desc, status, currency, investmentId });
            const balanceAfterTransactionPositive = await this.balanceAfterTransactionPositive(AccountId, transaction);

            if(!balanceAfterTransactionPositive){
                throw new Error("Insufficent fund");
            }
            return await newTransaction.save();
        } catch(err){
            // console.log(err);
            throw new Error(err.message);
        }
    }

    /**
     * 
     * @param {Date} date 
     * @param {number} days 
     * @returns 
     */
    #addDays = (date /**Date */, days /**number */) /** Date */ => {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }
    
      /**
       * 
       * @param {Transaction} transaction 
       */
    calculateCurrentValue = (transaction /** TransactionModel */) => {
        // get Days to cash out from start date
        let cashOutTimeDelta /** Number */ = Utils.addDays(transaction.createdAt, transaction.investmentId.waitPeriod).getTime() - transaction.createdAt;
        const timeDelta /** Number */ = new Date().getTime() - transaction.createdAt;
        let currentValue /** Date */ = timeDelta / cashOutTimeDelta;
        return currentValue >= 1 ? 1 : currentValue;

    }
    /**
     * 
     * @param {ObjectId} acctId : -> account Id
     * @returns {Promise<List<TransactionModel>>} for accountId
     */
    getUserTransactions = async (acctId /*:ObjectId */) /** List<TransactionModel> */=> {
        try{
            const transactions /*: List<TransactionModel> */= await Transaction
                                        .where({acctId: acctId})
                                        .populate("investmentId")
                                        .populate("acctId");

            // Get how much time has passed since invested
            const day /**number */ = 1000 * 60 * 60 * 24;
            const acctTransactions /** Array<TransactionModel> */ = [];
            for(let transaction /**TransactionModel */ of transactions){
                const transactionObject /**TransactionModel */ = transaction.toObject();
                const timeDelta /** Number */ = new Date().getTime()
                                                - new Date(transactionObject.createdAt).getTime();
                const daysPassedSinceTransaction /**number */= Math.floor(timeDelta / day);
                transactionObject.days = daysPassedSinceTransaction;

                const percent /**number */ = 0.01 * transactionObject.investmentId.yieldValue;
                const waitPeriod /**number */ = transactionObject.investmentId.waitPeriod;
                const daysFraction /**number */ = this.#transactionCurrentValue(daysPassedSinceTransaction, waitPeriod);
                const daysFractionMicro /**number */ = this.calculateCurrentValue(transactionObject);
                const yieldOverTime /**number */ = daysFractionMicro * (percent);
                const currentValue /**number */ = transactionObject.amount * (1 + yieldOverTime);
                transactionObject.currentValue =  +currentValue.toFixed(2);

                // Expected Value
                const expectedValue /**number */= transactionObject.amount * (1 + percent);
                transactionObject.expectedValue = expectedValue;

                // available for withdrawal
                const dayCreated /** Date */ = transactionObject.createdAt;
                const availableForWithdrawal /**Date */= this.#addDays(dayCreated, waitPeriod);
                transactionObject.availableForWithdrawal = availableForWithdrawal;
                acctTransactions.push(transactionObject);
            }
            acctTransactions.reverse();
            return acctTransactions;

        } catch(err){
            // console.log(err);
            throw new Error(err.message);
        }
    }
    /**
     * 
     * @param {ObjectId} acctId : -> account Id
     * @param {enum["pending", "approved", "rejected"]} status 
     * @returns {List<TransactionModel>} with status matching status
     */
    filterUserTransactionsByStatus = async (acctId /*:ObjectId */, status /*:string */="pending") /**List<TransactionModel> */=> 
    {
        try{
            const transactions /*: List<TransactionModel> */= await Transaction.where({acctId, status});
            transactions.reverse();
            return transactions;

        } catch(err){
            // console.log(err);
            throw new Error(err.message);
        }
    }
    /**
     * 
     * @param {ObjectId} transactionId 
     * @param {ObjectId} acctId
     * @param {Object} updateData
     */
    updateUserTransaction = async (transactionId /*:ObjectId */,updateData /*: Object */ = {}) /**boolean */ => {
        const transaction /*: TransactionModel | null */= await Transaction.findOne({_id: transactionId})
        let updatedTransaction = true
        if(transaction != null){
            await Transaction.updateOne({_id: transactionId}, updateData);  
            
        }
        else{
            updatedTransaction = false; 
        }
        return updatedTransaction;
    }



    /**
     * 
     * @param {TransactionModelPatch {status?: string, ...}} transactionQuery 
     * @returns {Promise<List<TransactionModel>>}
     */
    retrieveTransactions = async (transactionQuery /**: TransactionModelPatch  */) /**: Array<TransactionModel> */ => {
        return (await Transaction.where(transactionQuery).populate("investmentId").populate("acctId")).reverse();
    }
    /**
     * 
     * @param {ObjectId} acctId transaction acctId
     * @returns {Promise<{
     *  withdrawableTransactions: Array<TransactionModel>,
     *  withdrawableTransactionsAmount: number
     * }>}
     */
    retrieveWithdrawableTransactions = async (acctId /**ObjectId */) => {
        const withdrawableTransactionsStatus /** string */ = "approved"
        const userApprovedTransactions /**Array<Transaction> */ = await Transaction.where({acctId: acctId, 
                status: withdrawableTransactionsStatus})
                    .populate("acctId")
                    .populate("investmentId");

        // get withdrawable transactions => Wait Period has passed and status is approved
        let withdrawableTransactionsAmount = 0;
        const day /**number */ = 1000 * 60 * 60 * 24;
        const acctTransactions /** Array<TransactionModel> */ = [];
        for(let transaction /**TransactionModel */ of userApprovedTransactions){
            const transactionObject /**TransactionModel */ = transaction.toObject();
            const timeDelta /** number */ = new Date().getTime()
                                            - new Date(transactionObject.createdAt).getTime();
            const daysPassedSinceTransaction /**number */= Math.floor(timeDelta / day);
            transactionObject.days = daysPassedSinceTransaction;
            const waitPeriod = transactionObject.investmentId.waitPeriod;
            // console.log({waitPeriod, daysPassedSinceTransaction, transaction})

            if(daysPassedSinceTransaction >= waitPeriod){
                const percent /**number */ = 0.01 * transactionObject.investmentId.yieldValue;
                const daysFraction /**number */ = this.#transactionCurrentValue(
                                        daysPassedSinceTransaction, waitPeriod);
                const yieldOverTime /**number */ = daysFraction * (percent);
                const currentValue /**number */ = transactionObject.amount * (1 + yieldOverTime);
                transactionObject.currentValue =  +currentValue.toFixed(2);

                // add transaction currValue to withdrawableTransactions
                withdrawableTransactionsAmount += transactionObject.currentValue;
                acctTransactions.push(transactionObject);
            }
        }
        return {
            withdrawableTransactions: acctTransactions,
            withdrawableTransactionsAmount
        };
        
    }

    /**
     * 
     * @param {Array<Transaction>} transactions 
     * @param {{[Key: String]: String}} filterObject 
     * @returns {Array<Transaction>} filtered transactions list based on transaction Object
     */
    #filterTransactions = (transactions /**Array<TransactionModel> */, filterObject /**{[Key: String]: String} */) => {
        let filterTransactions /**Array<TransactionModel> */ = transactions.slice();

        for(let key in filterObject){
            let filterValue /** string */= filterObject[key];
            filterTransactions = filterTransactions.filter(transaction => transaction[key]?.toLowerCase() === filterValue.toLowerCase());
        }

        return filterTransactions;
    }

    orderTransactionsByCurrency = (transactions /** Array<Transaction> */) /**{[Key: String]: Array<Transaction} */ => {
        const transactionsByCurrency /**{[Key: String]: Array<Transaction} */ = {};

        for(let transaction /** Transaction */ of transactions){
            const transactionCurrency /** string */ = transaction.currency;

            if(!transactionsByCurrency.hasOwnProperty(transactionCurrency))
                transactionsByCurrency[transactionCurrency] = [];
            
            transactionsByCurrency[transactionCurrency].push(transaction)
        }

        return transactionsByCurrency;
    }
    
    /**
     * @desc Summarizes transactions by account
     * @param {ObjectId} acctId 
     * @returns {Promise<{[Key: String]: TransactionsSummaryDTO}>} transaction summary for each currency for account
     */
    userTransactionsSummary = async (acctId /**ObjectId */) /** Object*/ => {
        const transactionsSummary /** {[Key: String]: String } */ = {};
        // get all user Transactions that are successful
        const transactions /*: List<TransactionModel> */ = await this.getUserTransactions(acctId);
        const PERCENT = 100;
        let approvedTransactions /*: List<TransactionModel> */ = this.#filterTransactions(transactions, {status: "approved"});
        const orderedTransactions /** {[Key: String]: Array<Transaction>} */= this.orderTransactionsByCurrency(approvedTransactions);


        // for each currency, get a summary
        for(let transactionCurrency /** String */ in orderedTransactions){
            let currencyTransactions /** Array<Transaction> */ = orderedTransactions[transactionCurrency];

            // for each currency, get a summary
            // calculate total earnings from approvedTransactions
            let totalEarnings /** number */ = 0;
            let totalDeposits /** number */ = 0;
            let transactionsForCurrencyCount /** number */ = 0;
            for(let transaction /** TransactionModel */ of currencyTransactions){
                
                totalEarnings += transaction.currentValue;
                totalDeposits += transaction.amount;
                transactionsForCurrencyCount += 1;
            }

            // Calculate average return on investment
            const totalProfitFromInvestments /** number */ = totalEarnings - totalDeposits;
            const avgROI /** number */ = (totalProfitFromInvestments / totalDeposits) * PERCENT;
            let currencySummary /**{[Key: String]: number| string } */ = {
                totalDeposits, 
                totalEarnings, 
                totalProfitFromInvestments,
                transactionCurrency, 
                avgROI
            };
            transactionsSummary[transactionCurrency] = currencySummary;
        }
        return transactionsSummary;
    }
}

module.exports = {TransactionService, ITransactionService};