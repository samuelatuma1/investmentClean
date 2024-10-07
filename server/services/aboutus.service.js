const {AboutUs} = require("../models/aboutus.model");
const {AboutUsImage} = require("../models/aboutusimage.model");
const {Utils} = require("../utils/utils.utils.js");

class IAboutUsService{
     /**
     * @param {AboutUsDTO} aboutUs
     * @returns {Promise<AboutUs>} 
     */
      addAboutUs = async (aboutUsDTO /** AboutUsDTO */) /** AboutUs */ => {}

       /**
     * @desc ensures about
     * @param {AboutUsImageDTO} aboutUsImageDTO 
     * @param {Request} req
     * @returns {Promise<AboutUsImage>} aboutUsImage object
     */
    addAboutUsImage = async (aboutUsImageDTO /**AboutUsImageDTO */, req /** Request */) /**Promise<AboutUsImage> */=> {}

    /**
     * @returns {Promise<AboutUs>}
     */
    getAboutUs = async () /** AboutUs */ => {}

    /**
     * @desc returns AboutUsImage with imgUrl property or nukk
     * @param {Objectid} aboutusId 
     * @returns {Promise<AboutUsImage>}
     */
     getAboutUsImage = async (req, aboutusId /** ObjectId */) => {}
}
const AboutUsDTO = {
    title: String,
    body: String
}
const AboutUsImageDTO = {
    fieldname : String,
    mimeType: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    aboutUsId: String
}
class AboutUsService extends IAboutUsService{
    

    
    /**
     * @param {AboutUsDTO} aboutUs
     * @returns {Promise<AboutUs>} 
     */
    addAboutUs = async (aboutUsDTO /** AboutUsDTO */) /** AboutUs */ => {
        // Check if about us exists
        let aboutUs /** AboutUs */= await AboutUs.findOne();
        if(aboutUs != null){
            aboutUs.title = aboutUsDTO?.title || "About us Title";
            aboutUs.body = aboutUsDTO?.body || "About us body here";
        } else{
            aboutUs = new AboutUs(aboutUsDTO);
        }
        return await aboutUs.save();

    }
    
    /**
     * @param {Request} req
     * @returns {Promise<AboutUs>}
     */
    getAboutUs = async () => {
        let aboutUs /** AboutUs*/ =   Utils.convertModelToObject(await AboutUs.findOne());
        return aboutUs;
    }

    /**
     * @desc returns AboutUsImage with imgUrl property or nukk
     * @param {Request} req
     * @param {Objectid} aboutusId 
     * @returns {Promise<AboutUsImage>}
     */
    getAboutUsImage = async (req, aboutusId /** ObjectId */) => {
        try{
            let aboutUsImage /** AboutUs */ =  await AboutUsImage.findOne({aboutUsId: aboutusId});

            if(aboutUsImage ){

                aboutUsImage  = Utils.convertModelToObject(aboutUsImage);
                const imgUrl /**String */ = Utils.getImageUrl(req, aboutUsImage);
                aboutUsImage.imgUrl = imgUrl;
            }
            return aboutUsImage;
        }
        catch( ex /** Exception */){
            // console.log(ex)
            return null;
        }
    }
    /**
     * @desc deletes all aboutusimages and their accompanying media file
     */
    #deleteAllAboutUsImages = async () /** void */=> {
        const imagesToDelete /**AboutUsImage[] */= await AboutUsImage.find();
        for(let image of imagesToDelete){
            // await Utils.deleteFile(image.path);
        }
        await AboutUsImage.deleteMany();
    }
    /**
     * @desc ensures about
     * @param {AboutUsImageDTO} aboutUsImageDTO 
     * @param {Request} req
     * @returns {Promise<AboutUsImage>} aboutUsImage object
     */
    addAboutUsImage = async (aboutUsImageDTO /**AboutUsImageDTO */, req /** Request */) /**Promise<AboutUsImage> */=> {
        try{
            const aboutUs /**AboutUs */= await AboutUs.findOne({_id: aboutUsImageDTO.aboutUsId})
            
            console.log({aboutUs})
            if(aboutUs !== null){
                await this.#deleteAllAboutUsImages();
                let aboutUsImage = await new AboutUsImage(aboutUsImageDTO).save()
                console.log({aboutUsImage})
                aboutUsImage  = Utils.convertModelToObject(aboutUsImage);
                const imgUrl /**String */ = Utils.getImageUrl(req, aboutUsImage);
                aboutUsImage.imgUrl = imgUrl
                return aboutUsImage;
            }
            else{
                // if no about us
                // delete the newly saved image
                console.log("AbOUT TO DELETE")
                // await Utils.deleteFile(aboutUsImageDTO.path);
            }
            return null
        }
        catch(ex /**Exception */){
            console.log({ex});
            // delete file that may have been created
            // await Utils.deleteFile(aboutUsImageDTO?.path || "");
            return null;
        }
    }

}

module.exports = {AboutUsService, IAboutUsService, AboutUsDTO}