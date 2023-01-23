const fs /**fs */ = require('node:fs/promises');

const {Intro} = require("../models/home.intro.model.js");

const IntroDTO /** {[Key: String]: String} */ = {
    heading: String,
    body: String,
    adminWhatsappNum: String
};

const FileDTO /**{[Key: String]: String | Number } */=  {
    
    fieldname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  
}
class IIntroService {
     /**
     * @param {IntroDTO} introDTO 
     * @param {FileDTO} fileData 
     * @param {Request} req
     * 
     * @returns {Promise<Intro>}
     */
    createIntro = async (introDTO /**IntroDTO */, fileData /**FileSchema */, req /**Request */) /**Intro */ => {}

    /**
     * @desc => Returns the current HomePage Intro Document or null
     * @param {Request} req
     * @returns {Promise<Intro>}
     */
     getIntro = async (req /**Request */) => {}
}

class IntroService {
    /**
     * 
     * @param {String} filePath : URL to the file Path 
     * @returns {Promise<void>}
     */
    #deleteFile = async (filePath /**String */)/**void */ => {
        try{
            await fs.unlink(filePath);
            return ;
        } catch(ex /**Exception */){
            return ;
        }
    }

    /**
     * 
     * @param {IntroDTO} introDTO 
     * @param {FileDTO} fileData 
     * @param {Request} req
     * @returns {Promise<Intro>}
     */
    createIntro = async (introDTO /**IntroDTO */, fileData /**FileSchema */, req /**Request */) /**Intro */ => {
        
        // Store only one Intro Document
        // check if an Intro already exists
        const intro /**Document<Intro>? */= await Intro.findOne();
        // Delete if it does
        if(intro !== null){
            // Get file URL
            const filePath /** String */ = intro.img.path;
            await this.#deleteFile(filePath);
            await Intro.deleteOne();
        }

        // Create a new Intro.
        if(fileData === null){
            throw new Error("No image present")
        }
        introDTO.img = fileData;
        const saveIntro = new Intro(introDTO);

        const savedIntro /**Intro */ = await saveIntro.save();

        const result /**Intro */ = await this.getIntro(req);
        // console.log({result});
        return result;
        
    }
    /**
     * @param {Request} req 
     * @param {FileDTO} img 
     * @returns {String} URL to image Path
     */
    #getImageUrl = (req /**Request */, img /** img */) /**String */=> {
            const basePath /**URL */ = req.protocol + "://" + req.get("host") + '/'
            const imgPath /**String */ = basePath + img.path
            return imgPath;
    }

    /**
     * @desc converts a mongoDB Model to a plain old JavaScript Object
     * @param {GenericType} model 
     * @returns {Object}
     */
    #convertModelToObject = (model /**T */) /**Object */ => {
        if(model !== null){
            return model.toObject()
        }
        return null;
    }

    /**
     * @desc => Returns the current HomePage Intro Document or null
     * @param {Request} req
     * @returns {Promise<Intro>}
     */
    getIntro = async (req /**Request */) /**Intro */ => {
        let intro /**Intro */ =  await Intro.findOne();
        if(intro !== null){
            // Get url for image
            const img /**FileDTO */ = intro.img;
            const imgUrl /**String */ = this.#getImageUrl(req, img);
            intro = this.#convertModelToObject(intro);
            intro.imgUrl = imgUrl;
        }
        return intro;
    }
}

module.exports = {IntroService, IIntroService}