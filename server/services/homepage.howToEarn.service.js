const {HowToEarnImage, HowToEarn } = require("../models/home.howToEarn.model");
const {Utils} = require("../utils/utils.utils.js");


const FileDTO /**{[Key: String]: String | Number } */=  {
    
    fieldname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  
}

const HowToEarnDTO /**{[Key: String]: String | Number } */= {
    desc: String,
    steps: [{
        title: String,
        details: String
    }]
}

class IHowToEarnService {
    /**
     * @param {Request} req 
     * @returns {Promise<FileDTO>}
     */
     getHowToEarnImage = async (req) => {}

     /**
     * @param {FileDTO} fileData 
     * @returns {Promise<FileDTO>}
     */
    createHowToEarnImage = async (fileData /**FileDTO */) => {}

    /**
     * @param {HowToEarnDTO} howToEarnDTO 
     * @returns {Promise<HowToEarn>}
     */
     createHowToEarn = async (howToEarnDTO /** HowToEarnDTO */) /**HowToEarnDTO */=> {}

     /**
     * @returns {Promise<HowToEarn>}
     */
    getHowToEarn = async () => {}
}
class HowToEarnService{

    /**
     * 
     * @param {FileDTO} fileData 
     * @returns {Promise<FileDTO>}
     */
    createHowToEarnImage = async (fileData /**FileDTO */) => {
        const howToEarnImage /**HowToEarnImage */ = await HowToEarnImage.findOne();

        // Store only one Image on HowToEarnImage
        if(howToEarnImage !== null){
            const filePath = howToEarnImage.path;
            await Utils.deleteFile(filePath);
            await howToEarnImage.deleteOne();
        }

        if(fileData === null){
            throw new Error("No image present");
        }

        const newHowToEarnImg /**HowToEarnImage */ = new HowToEarnImage(fileData);
        const savedEarning = await newHowToEarnImg.save();
        return savedEarning;
    }

    /**
     * 
     * @param {Request} req 
     * @returns {Promise<FileDTO>}
     */
    getHowToEarnImage = async (req) => {
        let howToEarnImage /**HowToEarnImage */ = await HowToEarnImage.findOne();
        if(howToEarnImage !== null){
            howToEarnImage /**HowToEarnImage */ = Utils.convertModelToObject(howToEarnImage);
            const imgUrl /**String */ = Utils.getImageUrl(req, howToEarnImage);
            howToEarnImage.imgUrl = imgUrl;
        }
        return howToEarnImage;
    }

    /**
     * @param {HowToEarnDTO} howToEarnDTO 
     * @returns {Promise<HowToEarn>}
     */
    createHowToEarn = async (howToEarnDTO /** HowToEarnDTO */) /**HowToEarnDTO */=> {
        // console.log("Hey")
        const stepsExist /**HowToEarn*/ = await HowToEarn.findOne();
        if(stepsExist){
            await HowToEarn.deleteMany();
        }

        // save
        const newStepsToEarn = new HowToEarn(howToEarnDTO);
        return await newStepsToEarn.save();
    }

    /**
     * @returns {Promise<HowToEarn>}
     */
    getHowToEarn = async () => {
        return await HowToEarn.findOne();
    }
}

module.exports ={HowToEarnService, IHowToEarnService}