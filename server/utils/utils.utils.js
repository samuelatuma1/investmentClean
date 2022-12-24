const fetch = require("node-fetch");
const fs /**fs */ = require('node:fs/promises');
const OptionsObject = {
    method: String,
    url: String,
    params: Object,
    headers: Object,
    body: Object
}

const FileDTO /**{[Key: String]: String | Number } */=  {
    
    fieldname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  
}

class Utils {
    /**
     * @desc converts a mongoDB Model to a plain old JavaScript Object
     * @param {GenericType} model 
     * @returns {Object}
     */
     static convertModelToObject = (model /**T */) /**Object */ => {
        if(model !== null){
            return model.toObject()
        }
        return null;
    }
    /**
     * @desc returns the image url using request object and the fileobject
     * @param {Request} req 
     * @param {FileDTO} img 
     * @returns path to image url
     */
    static getImageUrl = (req /**Request */, img /** img */) /**String */=> {
        const basePath /**URL */ = req.protocol + "://" + req.get("host") + '/'
        const imgPath /**String */ = basePath + img.path
        return imgPath;
    }
    /**
     * @desc deletes file in the designated path
     * @param {String} filePath 
     * @returns 
     */
    static deleteFile = async (filePath /**String */)/**void */ => {
        try{
            
            await fs.unlink(filePath);
            
            return ;
        } catch(ex /**Exception */){
            console.log({ex})
            return ;
        }
    }
    /**
     * @desc fetches data 
     * @param {OptionsObject} options 
     * @returns {Promise<{[key: String]: String}>} JSON Response of fetch result or null
     */
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

    /**
         * @desc returns the time difference between time1 and time2 in given unit
         * @param {Date} time1 
         * @param {Date} time2 default new Date()
         * @param {String} unit enum ["d", "h", "m", "s"] default h => hours
         * @returns {number} time passed in expected unit
    */
    static timeDif = (time1, time2 = new Date(), unit = "h") => {
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

    /**
     * @desc merges two objects to form one object, objects must have key value pairs with values being dictionaries 
     * @param {{[Key: String]: {[Key: String]: any}} first_object 
     * @param {[Key: String]: {[Key: String]: any} second_object 
     * @returns {[Key: String]: {[Key: String]: any}} merged version of first_object and second_object
     */
    static mergeObjects = (first_object /**{[Key: String]: {[Key: String]: any} */, 
            second_object /**{[Key: String]: {[Key: String]: any} */) /**{[Key: String]: {[Key: String]: any}} */ => {
        const return_object /** {[Key: String]: any */ = {};
        for(let second_object_key /**string */ in second_object){
            if(!first_object.hasOwnProperty(second_object_key))
                first_object[second_object_key] = {};
            
            const second_object_value /** {[Key: String]: any} */ = second_object[second_object_key];
            const first_object_value /** {[Key: String]: any} */ = first_object[second_object_key];
            return_object[second_object_key] = {...first_object_value, ...second_object_value};
        }

        for(let first_object_key /**string */ in first_object){
            if(!return_object.hasOwnProperty(first_object_key)){
                return_object[first_object_key] = first_object[first_object_key];
            }
        }
        return return_object;
    }
}

module.exports = {Utils}