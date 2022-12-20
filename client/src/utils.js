/**
 * 
 * @param {string} key 
 * @returns the parsed value stored in localStorage of the given key or null
 */
export function getLsValue(key/*: string */) /*: string */{
    try{
    const parsedData = JSON.parse(localStorage.getItem(key));
    return parsedData;
    } catch(err){
        return err.message;
    }
}


/**
 * @desc Stores key and value in localstorage. 
 * Does the conversion of value from Native to JSON data 
 * @param {string} key 
 * @param {jsonSerializable} value 
 * @returns {boolean}
 */
export function storeDataInLs(key /*: string */, value /*: jsonSerializable */) 
    /*: boolean */ 
    {
    try{
        const JsonSerializedData /*: JSONSerializable */= JSON.stringify(value);
        localStorage.setItem(key, JsonSerializedData);
        return true;
    } catch(err){
        console.log(err.message);
        return false;
    }
}


