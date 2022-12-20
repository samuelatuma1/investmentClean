const {Stats /** StatsModel */} = require("../models/stats.model");

class IStatsService {
    /**
     * @desc Saves a new Stats if none exists, else replaces existing stats
     * @param {Stats} statsModel 
     * @returns {Promise<Stats>?}
     */
     saveOne = async (statsModel /**StatsModel */) /**StatsModel */ => {}

     /**
     * @desc returns the first Stats or null
     * @returns {Promise<Stats>?}
     */
    get = async () /**StatsModel? */ => {}
}

class StatsService {

    /**
     * @desc Saves a new Stats if none exists, else replaces existing stats
     * @param {Stats} statsModel 
     * @returns {Promise<Stats>}
     */
    saveOne = async (statsModel /**StatsModel */) /**StatsModel */ => {
        const statsExists /**Stats */= await Stats.findOne();
        if(statsExists !== null){
            await Stats.deleteMany();
        }
        const statsToSave /**StatsModel */ = new Stats(statsModel);
        
        return await statsToSave.save();
    }

    /**
     * @desc returns the first Stats or null
     * @returns {Promise<Stats>?}
     */
    get = async () /**StatsModel? */ => {
        return await Stats.findOne();
    }
}

module.exports = {StatsService, IStatsService};