const mongoose /**Mongoose */ = require("mongoose");

const CoinRatesSchema /**Schema */ =  new mongoose.Schema({
    coins: {
        type: [
            {
                id: String,
                symbol: String,
                current_price: Number,
                market_cap_change_percentage_24h: Number,
                image: String,
                name: String
            }
        ]
    }
}, {
    timestamps: true,
    strict: true
})

const CoinRates /**Model */ = mongoose.model("CoinRates", CoinRatesSchema);
module.exports = {CoinRates};