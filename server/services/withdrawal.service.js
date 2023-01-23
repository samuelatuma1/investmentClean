const {Withdrawal} = require("../models/withdrawal.model.js");


/** 
    Withdrawal => {
        acctId: ObjectId,
        userId: ObjectId,
        amount: number,
        currency: string
    }
*/


class IWithdrawalService {
    /**
     * @desc Creates a withdrawal if account has the available amount to fund it.
     * sets withdrawal status to pending;
     * @param {{
     *   acctId: ObjectId,
     *    userId: ObjectId,
     *    amount: number,
     *    currency: string
     * }} withdrawal 
     * @param {Number} withdrawableBal
     * @param {Array<Transaction>} withdrawableTransactions
     * @returns {Promise<Withdrawal>}
     */
    withdraw = async (withdrawal /**Withdrawal */, 
        withdrawableBal /**number */) /**Promise<Withdrawal> */ =>{};

    /**
     * @desc returns cuurrencies used by acctId and their corresponding withdrawable bal and pending balance
     * @param {Array<Transaction>} withdrawableTransactions 
     * @param {ObjectId} acctId 
     * @returns {Promise<{
     *     [key: String]: {
     *                    availableWithdrawableBalance: number,
     *                    pendingWithdrawableBalance: number
     *          }
     *     }}
     * }>}
     */
    getAllWithdrawableAndPendingBalance = async (withdrawableTransactions /**Array<Transaction> */,
        acctId /**ObjectId */) => {}

    
    /**
     * @returns {Promise<Array<Withdrawal>>} all withdrawals 
     */
     getAllWithdrawals = async () => {}

     /**
     * @param {ObjectId} withdrawalId 
     * @param {{[Key: String]: String}} updatedDTO 
     * @returns {Promise} 
     */
    updateWithdrawal = async (withdrawalId /**ObjectId */, 
    updatedDTO /** {[Key: String]: String} */) /**Query<> */=> {}
}

class WithdrawalService {
   /**
    * @desc retrieves pending and approved withdrawals for a particular currency, given accountId 
    * and currency
   * @param {ObjectId} acctId 
     * @param {String} currency 
    * @returns {Promise<Array<Withdrawal>>} 
    */
    #retrievePendingAndApprovedWithdrawalsForCurrency = async ( acctId /**ObjectId */, 
                        currency /**string */) => {

                        return await Withdrawal.where({
                                acctId: acctId,
                                    
                            }).where({
                                $or: [{status: "pending"}, {status: "approved"}],
                                currency: new RegExp(currency, "i")
                            });

    }

    /**
    * @desc retrieves pending and withdrawals for a particular currency, given accountId 
    * and currency
   * @param {ObjectId} acctId 
     * @param {String} currency 
    * @returns {Promise<Array<Withdrawal>>} 
    */
     #retrievePendingWithdrawalsForCurrency = async ( acctId /**ObjectId */, 
     currency /**string */) => {

     return await Withdrawal.where({
             acctId: acctId})
             .where({
             status: "pending",
             currency: new RegExp(currency, "i")
         });

    }

    /**
     * @param {Array<Withdrawal>} pendingOrApprovedWithdrawals 
     * @param {Array<Transaction>} withdrawableTransactions 
     * @param {string} currency
     * @returns {number} the withdrawable balance for this account
     */
    #calculateWithdrawableBalanceForCurrency = (
        pendingOrApprovedWithdrawals /** Array<Withdrawal>*/,
        withdrawableTransactions /**Array<Transaction> */,
        currency /**String */
        ) => {
            let pendingOrApprovedWithdrawalsAmt /**number */ = 0;
            for(let withdrawal /**Withdrawal */ of pendingOrApprovedWithdrawals){
                pendingOrApprovedWithdrawalsAmt  += withdrawal.amount;
            }

            // Get all transactions for given currency
            let allTransactionsWorth /**number */ = 0;
            const givenCurrencyTransactions = withdrawableTransactions.filter(transaction => 
                transaction.currency === currency);

            for(let transaction of givenCurrencyTransactions){
                allTransactionsWorth += transaction.currentValue;
            }
            return allTransactionsWorth - pendingOrApprovedWithdrawalsAmt;
    }
    
    /**
     * @desc Creates a withdrawal if account has the available amount to fund it.
     * sets withdrawal status to pending;
     * @param {{
        acctId: ObjectId,
        userId: ObjectId,
        amount: number,
        currency: string
    * }} withdrawal 
     * @param {Array<Transaction>} withdrawableTransactions
     * @returns {Promise<Withdrawal>}
     */
    withdraw = async (withdrawal /**Withdrawal */, 
                    withdrawableTransactions /**Array<Transaction> */) /**Promise<Withdrawal> */ => {
        try{
            // get all pending and approved withdrawals fpr currency
            const {
                acctId /**ObjectiD */, 
                userId /**ObjectId */, 
                amount /**number */, 
                currency /** String */
            } = withdrawal;

        const pendingOrApprovedWithdrawals /** Array<Withdrawal>*/ = await 
                this.#retrievePendingAndApprovedWithdrawalsForCurrency(acctId, currency);

        // get available withdrawable balance for currency
        const amtWithdrawable /**number */ = this.#calculateWithdrawableBalanceForCurrency(pendingOrApprovedWithdrawals, 
            withdrawableTransactions, currency);
        
        const requestedWithdrawal /**number  */ = withdrawal.amount;

        // console.log({requestedWithdrawal, amtWithdrawable});
        if(requestedWithdrawal < amtWithdrawable){
            const withdrawalModel /**Withdrawal */= new Withdrawal(withdrawal); 
            return await withdrawalModel.save();
        }
        return null;
        } catch(err /**Error */){
            // console.log("err =>", err);
            return null;
        }
    }

    /**
     * @param {Array<Transaction>} transactions 
     * @returns {{[key: String]: Array<Transaction>}}
     */
    #groupTransactionsByCurrency = (transactions /**Array<Transaction> */) => {
        const transactionsByCurrency /**Object<String, Array<Transaction>> */ = {};

        for(let transaction /**:Transaction */ of transactions){
            const transactionCurrency /** String */ = transaction.currency;
            let currencyTransactions /**Array<Transaction> */;

            if(transactionsByCurrency.hasOwnProperty(transactionCurrency))
                currencyTransactions  = transactionsByCurrency[transactionCurrency];
             else
                currencyTransactions = [];

            currencyTransactions.push(transaction);
            transactionsByCurrency[transactionCurrency] = currencyTransactions;
        }

        return transactionsByCurrency;
    }

    /**
     * 
     * @param {string} currency 
     * @param {ObjectId} acctId 
     * @param {Array<Transaction>} currencyTransactions 
     * @returns {Promise<{
     *      availableWithdrawableBalance: number,
     *       pendingWithdrawableBalance: number
     *  }>}
     */
    #currencyWithdrawableDetails = async ( currency /**String */, acctId /**ObjectId */,
    currencyTransactions /**: Array<Transaction> */) => {

        // Calculate withdrawable Balance for Currency
        const withdrawablesForCurrency /**Array<Withdrawal> */= await this.#retrievePendingAndApprovedWithdrawalsForCurrency(acctId, currency);

        const availableWithdrawableBalance /**number */ = this.#calculateWithdrawableBalanceForCurrency(withdrawablesForCurrency, currencyTransactions, currency);

        // Calculate pendingWithdrawals amount
        const pendingWithdrawals /**Array<Withdrawal> */ = await this.#retrievePendingWithdrawalsForCurrency(acctId, currency);

        const pendingWithdrawableBalance /**number */ = pendingWithdrawals
            .reduce((cummPendingAmount /**number */, currWithdrawal /** Withdrawal */) => 
                cummPendingAmount + currWithdrawal.amount
            , 0)

        return {
            availableWithdrawableBalance,
            pendingWithdrawableBalance
        }

    }

    /**
     * @param {Array<Transaction>} withdrawableTransactions 
     * @param {ObjectId} acctId 
     * @returns {Promise<{
     *     [key: String]: availableWithdrawableBalance: number,
     *               pendingWithdrawableBalance: number
     *}}}>}
     */
    getAllWithdrawableAndPendingBalance = async (withdrawableTransactions /**Array<Transaction> */,
        acctId /**ObjectId */) => {

        // Group transactions by currency
        const groupTransactionsByCurrency /**{[key: String]: Array<Transaction>} */= this.#groupTransactionsByCurrency(withdrawableTransactions);
        // console.log(groupTransactionsByCurrency);

        // retrieve availableWithrawableBalance and pendingWithdrawableBalance 
        const currencyWithdrawableDetails /**{[key: String]: {[Key: String]: number}} */ = {};
        
        for(let currency /** String */ in groupTransactionsByCurrency){
            const currencyTransactions /**Array<Transaction> */ = groupTransactionsByCurrency[currency];
            currencyWithdrawableDetails[currency] =await this
                .#currencyWithdrawableDetails(currency, acctId, currencyTransactions );
        }

        return currencyWithdrawableDetails;
    }

    /**
     * @returns {Promise<Array<Withdrawal>>} all withdrawals 
     */
    getAllWithdrawals = async () /**Promise<Array<Withdrawal>>*/ => {
        return await Withdrawal.where().populate("acctId").populate("userId");
    }

    /**
     * @param {ObjectId} withdrawalId 
     * @param {{[Key: String]: String}} updatedDTO 
     * @returns {Promise} 
     */
    updateWithdrawal = async (withdrawalId /**ObjectId */, 
    updatedDTO /** {[Key: String]: String} */) /**Query<> */=> 
    {
        const updateWithdrawalResponse /**var */= await Withdrawal
            .findByIdAndUpdate(withdrawalId, updatedDTO);

        // update each field in updatedDTO
        for(const updatedField /**String */ in updatedDTO){
            updateWithdrawalResponse[updatedField] = updatedDTO[updatedField];
        }

        // console.log("UPDATED WITHDRAWAL => ", updateWithdrawalResponse);
        return updateWithdrawalResponse;
    }

}

module.exports = {WithdrawalService, IWithdrawalService};