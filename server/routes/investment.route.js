const express = require("express")
const investmentRoute = express.Router()
const {ValidateToken} = require("../middlewares/token.middleware.js");

// import controller
const {InvestmentController} = require("../controllers/investment.controller");

// Import Middleware
const {investmentValidator, investmentUpdateValidator} = require("../middlewares/investment.middleware");

// Services
const {InvestmentService} = require("../services/investment.service");
const {AuthService} = require("../services/auth.service");



const investment = new InvestmentController(
            new InvestmentService(),
            new AuthService());

investmentRoute.route("/create")
    .post(ValidateToken.validateToken, investmentValidator, investment.createInvestment);

investmentRoute.route("/retrieve/:investmentId")
    .get(ValidateToken.validateToken, investment.retrieveInvestment)

investmentRoute.route("/retrieve")
    .get(ValidateToken.validateToken, investment.retrieveInvestments)

investmentRoute.route("/update/:investmentId")
    .post(ValidateToken.validateToken, investmentUpdateValidator, investment.updateInvestment);

investmentRoute.route("/delete/:investmentId")
    .delete(ValidateToken.validateToken, investment.softDeleteInvestment);

module.exports = {investmentRoute};
