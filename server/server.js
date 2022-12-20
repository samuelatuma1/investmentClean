require("dotenv").config()
// DB Setup
const {MongooseSetup, ConfigurationSettings} = require("./config.js")
const DBURI = process.env.MONGOURI
new MongooseSetup().configDB(DBURI)

const {app} = require("./index.js")



const PORT = ConfigurationSettings.getEnv().PORT || 9000;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
