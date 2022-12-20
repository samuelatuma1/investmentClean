const express = require("express");
const {ValidateToken} = require("../middlewares/token.middleware.js");
const {AccountService} = require("../services/account.service.js");
const {TransactionService} = require("../services/transaction.service.js");
const {InvestmentService} = require("../services/investment.service.js");
const {AuthService} = require("../services/auth.service.js");
const {Mail} = require("../services/mail.service.js");
const {WithdrawalService} = require("../services/withdrawal.service.js");


const {WithdrawalController} = require("../controllers/withdrawal.controller.js");


const mailServiceProvider = process.env.service;
const email_username = process.env.email_username;
const email_password = process.env.email_password; 

const withdrawalController /**WithdrawalController*/ = new WithdrawalController(
    new WithdrawalService(), 
    new TransactionService(),
    new AccountService(),
    new AuthService(), 
    new Mail(mailServiceProvider, email_username, email_password)
)
const withdrawalRoute /**Router */ = express.Router();

withdrawalRoute.route('/withdraw')
    .post(ValidateToken.validateToken, withdrawalController.withdraw);

withdrawalRoute.route("/getwithdrawablebalance")
    .get(ValidateToken.validateToken, withdrawalController.getWithdrawableAndPendingBalance);

withdrawalRoute.route('/getwithdrawals')
    .get(ValidateToken.validateToken, withdrawalController.getAllWithdrawals);

withdrawalRoute.route('/updatewithdrawal/:withdrawalId')
    .put(ValidateToken.validateToken, withdrawalController.updateWithdrawal);

module.exports = {withdrawalRoute};

