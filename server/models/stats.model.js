const mongoose /**Mongoose */ = require("mongoose");

const StatsSchema /**Schema */ = mongoose.Schema({
    stats1: {
        data: {
            type: String,
            default: "Stat1 Data"
        },
        desc: {
            type: String,
            default: "Stat One Description"
        }
    },

    stats2: {
        data: {
            type: String,
            default: "Stat2 Data"
        },
        desc: {
            type: String,
            default: "Stat two Description"
        }
    },

    stats3: {
        data: {
            type: String,
            default: "Stat3 Data"
        },
        desc: {
            type: String,
            default: "Stat three Description"
        }
    },
    stats4: {
        data: {
            type: String,
            default: "Stat4 Data"
        },
        desc: {
            type: String,
            default: "Stat four Description"
        }
    },

});

const Stats /**  Model  */= mongoose.model("Stats", StatsSchema);
module.exports = {Stats};