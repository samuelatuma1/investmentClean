const mongoose = require("mongoose")
const env = process.env;
class MongooseSetup {
    async configDB(uri){
        console.log("Setting Up Db")
        await mongoose.connect(uri)
        console.log("Connected to DataBase ", uri)
    }

    
}
class ConfigurationSettings {
    /**
     * 
     * @returns {{[key: String]: String}} process.env Object
     */
    static getEnv = () => /**Object<String, Number | String> */{
        return env;
    }
}
module.exports = {MongooseSetup, ConfigurationSettings}