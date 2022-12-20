const fetch = require("node-fetch");
const { CoinRatesService } =require("./server/services/homepage.coinrates.service");
const OptionsObject = {
    method: String,
    url: String,
    params: Object,
    headers: Object,
    body: Object

}
const options = {
    method: 'GET',
    url: 'https://coingecko.p.rapidapi.com/coins/markets',
    params: {vs_currency: 'usd', page: '1', per_page: '3', order: 'market_cap_desc'},
    headers: {
      'X-RapidAPI-Key': '0bb1103337mshd8f0862afdaeaacp166360jsn72e2bf659005',
      'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
    }
  };





async function fetchData(options /**Options */) /**Object*/{
    try{
        // ADD Params from options.params to url
        const params /**{[key: String]: String} */ = options.params;
        let url /**String*/ = params !== null ? options.url + "?": options.url 

        if(params !== null){
            for(let key /**String */ in params){
                const val /**string */ = params[key];
                url += `${key}=${val}&`
            }
            url = url.slice(0, url.length - 1);
        }
        
        const req /**Request */= await fetch(url, options)
        if(req.ok){
            const res /**Response*/ = await req.json();
            console.log(res);
            return res;
        }
        return null;
    } catch(e /**Exception */){
        return null;
    }

}

class Utils {
    static fetchData = async (options /**Options */) => /**Object*/{  
        try{
            // ADD Params from options.params to url
            const params /**{[key: String]: String} */ = options.params;
            let url /**String*/ = params !== null ? options.url + "?": options.url 

            if(params !== null){
                for(let key /**String */ in params){
                    const val /**string */ = params[key];
                    url += `${key}=${val}&`
                }
                url = url.slice(0, url.length - 1);
            }
            
            const req /**Request */= await fetch(url, options)
            if(req.ok){
                const res /**Response*/ = await req.json();
                console.log(res);
                return res;
            }
            return null;
        } catch(e /**Exception */){
            return null;
        }
    }
}
console.log("################3###########################################################")
async function justCall(){
    await Utils.fetchData(options);
}
// justCall();
console.log("############################################################################")

const time1 = new Date();
const time2 = new Date("2022-11-26T06:05:03.082+00:00");
console.log(time1)
/**
 * 
 * @param {Date} time1 
 * @param {Date} time2 
 * @param {String} unit enum ["d", "h", "m", "s"] default h => hours
 * @returns {number} time passed in expected unit
 */
function timeDif(time1, time2 = new Date(), unit = "h") {
    const timeInMs /**number */ = Math.abs(time2 - time1);
    let secondsPassed /**number */ = 1000;
    
    let timeDelta /**number */ = timeInMs / secondsPassed;

    switch (unit){
        case "m":
            timeDelta = timeDelta / (60);
            break;
        case "h":
            timeDelta = timeDelta / (60 * 60);
            break;

        case "d":
            timeDelta = timeDelta /(60 * 60 * 24);
            break;

    }
    return Math.round(timeDelta);
}

const service = new CoinRatesService()

async function retrieve(){
   const coinst =  await service.retrieveCoins()
   console.log({coinst})
}
// retrieve()