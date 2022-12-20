const {IInvestmentService} = require("../services/investment.service");
const {validationResult} = require("express-validator");

/**
 * @Route /investment
 */
class InvestmentController {
    investmentService /*: IInvestmentService */;
    authService /*: AuthService  */;
    /**
     * 
     * @param {IInvestmentService} investmentService 
     * @param {AuthService} authService
     */
    constructor(investmentService /*: IInvestmentService */, authService /*: AuthService */){
        this.investmentService = investmentService;
        this.authService = authService;

    }

        /** 
     * @method Post /create
     * @protected (userId in req.userId)
     * @requires Admin Access
     * @payload {
     *  amount: number , 
     *  yield : number , 
     *  waitPeriod : number, 
     * currency?: string
     *  desc: string}
     * }
     * @params {}, @query {}
     * @returns {transaction: TransactionObject}
    */
    createInvestment = async (req /*:Request */, res /*; Response */) /*: JsonResponse */ => {
        try{
            // Ensure form is filled right
            const formErrors = validationResult(req).errors;
            if(formErrors.length > 0) return res.status(400).json({formErrors});

            // Ensure Uploader is admin
            const userId /*: ObjectId */ = req.userId;
            const userIsAdmin /*: boolean */= await this.authService.verifyIsAdminFromId(userId);
            // console.log({userIsAdmin})
            if(!userIsAdmin)
                return res.status(403).json({"error": `User with id => ${userId} not authorized to create investment `});
            
            const investment /**: Investment */ = await this.investmentService.createInvestment(req.body);
            
            return res.status(201).json(investment);
        }
        catch(err /**: Exception */){
            return res.status(500).json({error: err.message});
        }
    }

    
    /** 
    * @method Get /retrieve/:investmentId
    * @protected (userId in req.userId)
    * @payload {
    * }
    * @params {investmentId: ObjectId}, @query {}
    * @returns {Investment}
   */
    retrieveInvestment = async (req /*:Request */, res /*: Response */) => {
        try{
            const params /* {investmentId: ObjectId} */ = req.params;
            const investmentId /**: ObjectId */ = params.investmentId
            const investment /**: Investment? */ = await this.investmentService
                        .retrieveInvestment(investmentId);
            if(investment != null){
                return res.status(200).json(investment);
            }
            return res.status(404).json({message: `Investment with Id => ${investmentId} not found`})
        } catch (err /*: Exception */){
            return res.status(500).json({error: err.message});
        }
    }

    
    /** 
    * @method Get /retrieve
    * @protected (userId in req.userId)
    * @payload {
    * }
    * @params {}, @query {}
    * @returns {List<Investment>}
   */
     retrieveInvestments = async (req /*:Request */, res /*: Response */) => {
        try{
            const investments /**: List<Investment> */ = await this.investmentService
                        .retrieveInvestments();
            return res.status(200).json(investments);
        } catch (err /*: Exception */){
            return res.status(500).json({error: err.message});
        }
    }

    /** 
     * @method Post /update/:investmentId
     * @requires Admin Access
     * @protected (userId in req.userId)
     * @payload {
     *  amount?: number , 
     *  yield? : number , 
     *  waitPeriod? : number, 
     * currency?: string
     *  desc?: string}
     * }
     * @params {investmentId: ObjectId}, @query {}
     * @returns {{updated: boolean, message: string}}
    */
     updateInvestment = async (req /*: Request */, res /*: Response */) => {
        try{
            // Ensure form is filled right
            const formErrors = validationResult(req).errors;
            if(formErrors.length > 0) return res.status(400).json({formErrors});

            const params = req.params;
            // Ensure Update is by admin
            const userId /*: ObjectId */ = req.userId;
            const userIsAdmin /*: boolean */= await this.authService.verifyIsAdminFromId(userId);
            // console.log({userIsAdmin})
            if(!userIsAdmin)
                return res.status(403).json({"error": `User with id => ${userId} not authorized to create investment `});
            const investmentId /**: ObjectId */ = params.investmentId;
            const updateInvestment /**: boolean*/ = await this.investmentService
                                                .updateInvestment(investmentId, req.body);
            if(updateInvestment){
                return res.status(200).json({updated: true,
                                message: `Investment with Id => ${investmentId} updated`                    
                });
            
            } else{
                return res.status(404).json({updated: false,
                    message: `Investment with Id => ${investmentId} not updated` });
            }
        } catch (err /*: Exception */){
            return res.status(500).json({error: err.message});
        }
    }


    /** 
    * @method Get /delete/:investmentId
    * @protected (userId in req.userId)
    * @payload {
    * }
    * @params {investmentId: ObjectId}, @query {}
    * @returns {{message: string}}
   */
    softDeleteInvestment = async (req /**: Request */, res /**: Response */) => {
        try{
            const params = req.params;
            // Ensure Delete is by admin
            const userId /*: ObjectId */ = req.userId;
            const userIsAdmin /*: boolean */= await this.authService.verifyIsAdminFromId(userId);
            // console.log({userIsAdmin})
            if(!userIsAdmin)
                return res.status(403).json({"error": `User with id => ${userId} not authorized to create investment `});

            const investmentId /**: ObjectId */ = params.investmentId;
            const deletedInvestment /*: boolean */= await this.investmentService.softDeleteInvestment(investmentId);
            if(deletedInvestment){
                return res.status(200).json({
                    message: `Successfully deleted investment with id => ${investmentId}`})
            }
            return res.status(200).json({
                message: `Investment with Id ${investmentId} does not exist`});
        } catch(err /*: Exception */){
            return res.status(500).json({message: err.message});
        }
        
    }

}

module.exports = {InvestmentController};