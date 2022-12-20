const express = require("express");

const accountRoute = express.Router();
const {AccountController} = require("../controllers/account.controller.js");
const {AccountService} = require("../services/account.service.js");
const {ValidateToken} = require("../middlewares/token.middleware.js");

const {TransactionService} = require("../services/transaction.service.js");

const account = new AccountController(new AccountService(), new TransactionService());

accountRoute.route("/createacct")
    .post(ValidateToken.validateToken, account.createAccount);

accountRoute.route("/getaccts")
    .get(ValidateToken.validateToken, account.getAccounts);

accountRoute.route("/getacct")
    .get(ValidateToken.validateToken, account.getAccount);

accountRoute.route("/deleteacct/:acctId")
    .delete(ValidateToken.validateToken, account.deleteAccount);

accountRoute.route("/createtransaction/:acctId")
    .post(ValidateToken.validateToken, account.createTransaction);
        
module.exports = {accountRoute};
