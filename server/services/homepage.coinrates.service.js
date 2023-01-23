const { isObjectIdOrHexString } = require("mongoose");
const {CoinRates} = require("../models/coinRate.model");
const { ObjectId } = require( "mongoose");
const { Utils } =  require("../utils/utils.utils");
const {ConfigurationSettings} = require("../config.js");


const IsValidDTO = {
    isValid: Boolean,
    id: ObjectId
}

class ICoinRatesService {
    /**
     * @desc Returns CoinRates with the last 6 hours or null
     * @returns {Promise<CoinRates>}
     */
     retrieveCoins = async () => {}
}


class CoinRatesService {


    /**
     * @returns { Promise<{
            isValid : Boolean,
            id: ObjectId
        }>} 
     */
    coinsIsValid = async () => {
        let ratesResponse  /**IsValidDTO */= {
            isValid : false,
            id: ""
        }
        const currentRates /**CoinRates */ = await CoinRates.findOne();
        if(currentRates !== null){
            // check last time coinsRate was updateDecorator
            const currentRatesLastDate /*Date */ = currentRates.updatedAt;

            const noOfLastHrsBeforeLastUpdate = Utils.timeDif(currentRatesLastDate, new Date(), "s");
            const everyXMins /**number */= 1;
            ratesResponse.id = currentRates._id;
            console.log({everyXMins, noOfLastHrsBeforeLastUpdate})
            if(everyXMins >= noOfLastHrsBeforeLastUpdate){
                ratesResponse.isValid = true;      
            }
        }
       
        return ratesResponse;
    }

    #fetchCoinsWithCoinGecko = async () => {
        const X_RapidAPI_Key /**String */= ConfigurationSettings.getEnv()["X-RapidAPI-Key"];
        const X_RapidAPI_Host /**String */= ConfigurationSettings.getEnv()["X-RapidAPI-Host"];
        const vs_currency /**String */ = "usd";
        const order /**String */= 'market_cap_desc';
        const page /** String */ = "1";
        const per_page /** String */ = "5"
 
        const url /** String */ = "https://api.coingecko.com/api/v3/coins/markets";
        const method /**String */ = "GET"
 
        const options = {
             method, url, params: {vs_currency, page, per_page, order},
             headers: {
                 'X-RapidAPI-Key': X_RapidAPI_Key,
                 'X-RapidAPI-Host': X_RapidAPI_Host
             }
        }
        
        const response /**Array<CoinsDTO> */ = await Utils.fetchData(options); 
        return response;
    }

    /**
     * 
     * @returns {Promise<CoinRates>}
     */
    retrieveCoins = async () => {
        
        // check if CoinRates is valid
        let {isValid /**Boolean */, id /**ObjectId */ } = await this.coinsIsValid();
        if(!isValid){
            // fetch new 
            const coins /**Array<Coin>? */ = await this.#fetchCoinsWithCoinGecko();
            console.log({coins})
            if(coins !== null){
                if(id !== ""){
                    await CoinRates.findByIdAndUpdate(id, {coins: coins});
                } else{
                    const coinRates /**CoinRates */ = new CoinRates({coins: coins});
                    const savedCoin /**CoinRates */= await coinRates.save();
                    id = savedCoin._id;
                    
                }
                
            }

        }
        return id ? CoinRates.findById(id): null;        
    }
}

module.exports = {CoinRatesService, ICoinRatesService}

