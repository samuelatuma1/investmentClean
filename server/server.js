require("dotenv").config()
// DB Setup
const {MongooseSetup, ConfigurationSettings} = require("./config.js")
const DBURI = process.env.MONGOURI
const mongoDb /**Mongo Setup*/ = new MongooseSetup()
async function setUpDb(){
    await mongoDb.configDB(DBURI)
}

setUpDb();

const {app} = require("./index.js")



const PORT = ConfigurationSettings.getEnv().PORT || 9000;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
