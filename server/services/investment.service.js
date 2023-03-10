const {Investment} = require("../models/investment.model");

class IInvestmentService{
    /**
     * @desc Creates a new Investment if it doesn't exist in db
     * @param {{amount: number , yieldValue : number , waitPeriod : number, desc: string})} param0 
     * @returns {Investment}
     */
    async createInvestment(investmentBody){
        throw new Error("createInvestment not implemented");
    }
     /**
     * 
     * @param {ObjectId} _id Investment Id
     * @returns {Investment | null} investment with the investment Id
     */
    retrieveInvestment = async (_id /*: ObjectId */) /*: Investment */ => {
        throw new Error("retrieveInvestment not implemented")
    }

    /**
     * @desc Returns all investments
     * @returns {List<Investment>} 
     */
     retrieveInvestments = async () /**: List<Investment> */ => {
        throw new Error("retrieveInvestments not implemented")
    }

    /**
     * 
     * @param {ObjectId} _id Investment Id
     * @param {{amount, yieldValue, waitPeriod, desc, currency}} updateData 
     * @returns {boolean}
     */
     updateInvestment = async (_id /**: Objectid */, updateData /**: Investment */) => {
        throw new Error("updateInvestment not implemented")

     }

     /**
     * @desc sets investment with _id delete key to true
     * @param {ObjectId} _id Id of investment to be deleted
     * @returns boolean
     */
      softDeleteInvestment = async (_id /**: Objectid */) /*: boolean */=> {
        throw new Error("deleteInvestment not implemented")
      }


    /**
     * @param {String} desc 
     * @returns {Investment}
     */
    findInvestmentByDesc = async (desc /** String */) => {}

     /**
     * @desc creates an investment with desc default_currencyName if it doesn't find one. returns investment
     * @param {String} currency 
     * @returns {Promise<Investment>}
     */
      getOrCreateDefaultInvestment = async ( currency /** String */ = "dollars") /** Investment */ => {}
}


class InvestmentService extends IInvestmentService{
    createInvestment = async ( investmentBody) /*: Investment */ => {
       
        // Ensure Investment doesn't already exist
        const {amount /*: number */, yieldValue /**: number */, waitPeriod /*: number */,
         desc /**: string */, currency /**: string */} = investmentBody;
         
         const searchData /**: Object */ = {amount, yieldValue, 
                        waitPeriod, currency: currency || "dollars"}
        const acctExists = await Investment.findOne(searchData);
        // console.log({acctExists})
        if(acctExists){
            if(acctExists.deleted){
                await Investment.findOneAndUpdate(searchData, {deleted: false});
            }
            return acctExists;
        }
            
        
        const investment /*: Investment */= new Investment({amount, yieldValue, waitPeriod, desc, currency});
        const savedInvestment /*: Investment */ = await investment.save();

        return savedInvestment;
    }

    
    retrieveInvestment = async (_id /*: ObjectId */) /*: Investment */ => {
        return await Investment.findById(_id);
    }

    
    retrieveInvestments = async () /**: List<Investment> */ => {
        return await Investment.where({deleted: { $ne: true}});
    }

    retrieveInvestmentsWithoutDefault = async () /**: List<Investment> */ => {
        const defaultConstant = "default_";
        const investments = await Investment
            .where({deleted: { $ne: true}});
        return  investments
                .filter(investment => !(investment.desc.includes(defaultConstant)));
    }

    updateInvestment = async (_id /**: Objectid */, updateData /**: Investment */) /*: boolean */=> {
        // Get item with Id
        const investmentInDb /**: Investment */ = await Investment.findById(_id);
        if(investmentInDb !== null){
            await Investment.findByIdAndUpdate(_id, updateData);
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {String} desc 
     * @returns {Promise<Investment>}
     */
    findInvestmentByDesc = async (desc /** String */) => {
        return await Investment.findOne({desc})
    }

    /**
     * 
     * @param {ObjectId} _id Id of investment to be deleted
     * @returns boolean
     */
    softDeleteInvestment = async (_id /**: Objectid */) /*: boolean */=> {
        // Get item with Id
        const investmentInDb /**: Investment */ = await Investment.findById(_id);
        if(investmentInDb !== null){
            await Investment.findByIdAndUpdate(_id, {deleted: true});
            return true;
        }
        return false;
    }

    /**
     * @desc creates an investment with desc default_currencyName if it doesn't find one. returns investment
     * @param {String} currency 
     * @returns {Promise<Investment>}
     */
    getOrCreateDefaultInvestment = async ( currency /** String */ = "dollars") /** Investment */ => {
        const desc /** String */ =  `default_${currency}`;
        let defaultCurrency /** Investment */=  await this.findInvestmentByDesc(desc);
        console.log({defaultCurrency})
        if(defaultCurrency === null){
            const amount = 1;
            const yieldValue = 0.00001;
            const waitPeriod = 0;

            const investment = new Investment({amount, yieldValue, waitPeriod, currency, desc});
            defaultCurrency = await investment.save();
        }
        return defaultCurrency;
    }
}

module.exports = {IInvestmentService, InvestmentService};