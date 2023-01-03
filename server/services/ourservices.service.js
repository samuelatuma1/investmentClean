const {OurServices} = require("../models/ourservices.model");
const {OurServicesImage} = require("../models/ourservicesimage.model");
const {Utils} = require("../utils/utils.utils.js");


const OurServicesDTO = {
    title: String,
    body: String
}
const OurServicesImageDTO = {
    fieldname : String,
    mimeType: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    ourServicesId: String
}

const OurServicesAndImages = {
    title: String,
    body: String,
    image: {
        ourServicesId: String,
        imageUrl: String
    }
}


class IOurServicesService{
      /**
     * @param {OurServicesDTO } OurServicesDTO 
     * @returns {Promise<OurServices>} 
     */
    addOurServices = async (OurServicesDTO /** OurServicesDTO */) /** OurServices */ => {}

    /**
     * @returns {Promise<Array<OurServices>>}
     */
    getOurServices = async () => {}

    /**
     * @desc returns AboutUsImage with imgUrl property or null
     * @param {Request} req
     * @param {Objectid} ourServicesId 
     * @returns {Promise<OurServicesImage>}
     */
     getOurServicesImage = async (req, ourServicesId /** ObjectId */) => {}

    /**
     * @desc adds our services image. deletes all unconnected our services images along the way
     * @param {OurServicesImageDTO} ourServicesImageDTO 
     * @param {Request} req
     * @returns {Promise<OurServicesImage>} ourServices object
     */
     addOurServicesImage = async (ourServicesImageDTO /**AboutUsImageDTO */, req /** Request */) /**Promise<AboutUsImage> */=> {}


     /**
     * 
     * @param {Request} req 
     * @returns {Promise<Array<OurServicesAndImages>>}
     */
    getAllOurServicesAndImages = async (req /** Request */) /** Array<OurServicesAndImages> */=> {}

    /**
     * 
     * @param {ObjectId} id 
     * @param {OurServicesDTO} ourServiceDTO 
     * @returns {Promise<OurServices>}
     */
     updateOurService = async (id /** ObjectId */, ourServiceDTO /** OurServiceDTO */) => {}


      /**
     * @param {Request} req 
     * @param {ObjectId} _id 
     * @returns {Promise<OurServices>}
     */
    getOurService = async (req, _id /** ObjectId */) /** OurServices */=> {}

}

class OurServicesService extends IOurServicesService{

    
    /**
     * @param {OurServicesDTO } OurServicesDTO 
     * @returns {Promise<OurServices>} 
     */
    addOurServices = async (OurServicesDTO /** OurServicesDTO */) /** OurServices */ => {

        // max our services count
        const max_our_services_count = 5
        let ourServices /** OurServices */= await OurServices.find();
        if(ourServices.length > max_our_services_count){
            console.log("Max services count exceeded");
            return null
        }

        const newOurServices /** OurService */ = new OurServices(OurServicesDTO);
        return await newOurServices.save();
    }
    
    /**
     * @param {Request} req
     * @returns {Promise<Array<OurServices>>}
     */
    getOurServices = async () => {
        return await OurServices.find();
    }

    /**
     * 
     * @param {ObjectId} id 
     * @param {OurServicesDTO} ourServiceDTO 
     * @returns {OurServices}
     */
    updateOurService = async (id /** ObjectId */, ourServiceDTO /** OurServiceDTO */) => {
        try{
            const ourService /** OurService */ = await OurServices.findById(id);
            if(ourService !== null){
                const title /** String */ = ourServiceDTO.title;
                const body /** String */ = ourServiceDTO.body;
                if(title){
                    ourService.title = title;
                }
                if(body){
                    ourService.body = body;
                }

                return await ourService.save();
            }
            return null;

        }
        catch(ex /** Exception */){
            console.log(ex.message);
            return null;
        }
    }

    /**
     * @desc returns AboutUsImage with imgUrl property or null
     * @param {Objectid} ourServicesId 
     * @returns {Promise<OurServicesImage>}
     */
    getOurServicesImage = async (req, ourServicesId /** ObjectId */) => {
        try{
            let ourServicesImage /** OurServicesImage */ =  await OurServicesImage.findOne({ourServicesId: ourServicesId});

            if(ourServicesImage  ){
                
                ourServicesImage  = Utils.convertModelToObject(ourServicesImage);
                const imgUrl /**String */ = Utils.getImageUrl(req, ourServicesImage);
                ourServicesImage.imgUrl = imgUrl;
            }
            return ourServicesImage;
        }
        catch( ex /** Exception */){
            console.log(ex)
            return null;
        }
    }

    /**
     * @desc deletes all our service images without an accompanying service
     */
    #deleteAllOurServicesImagesWithoutService = async () /** void */=> {
        const possibleImagesToDelete /**AboutUsImage[] */= await OurServicesImage.find();
        for(let image of possibleImagesToDelete){
            const serviceExists = await OurServices.findOne({_id: image.ourServicesId});
            if(!serviceExists){
                await Utils.deleteFile(image.path);
            }
        }
    }

    /**
     * @desc deletes all our service images without an accompanying service
     * @param {ObjectId} serviceId
     */
     #deleteAllOurServicesImagesWithServiceId = async ( serviceId /** ObjectId */) /** void */=> {
        const possibleImagesToDelete /**AboutUsImage[] */= await OurServicesImage.find({ourServicesId: serviceId});
        for(let image of possibleImagesToDelete){
                await OurServicesImage.findByIdAndDelete(image._id);
                await Utils.deleteFile(image.path);
            
        }
    }

    /**
     * @desc ensures about
     * @param {OurServicesImageDTO} ourServicesImageDTO 
     * @param {Request} req
     * @returns {Promise<OurServicesImage>} ourServices object
     */
    addOurServicesImage = async (ourServicesImageDTO /**AboutUsImageDTO */, req /** Request */) /**Promise<AboutUsImage> */=> {
        try{
            const ourServices /**OurServices*/= await OurServices.findOne({_id: ourServicesImageDTO.ourServicesId})
            // console.log({aboutUs})
            if(ourServices !== null){
                await this.#deleteAllOurServicesImagesWithoutService();
                // delete service's current image if exists
                await this.#deleteAllOurServicesImagesWithServiceId(ourServicesImageDTO.ourServicesId);
                let ourServicesImage = await new OurServicesImage(ourServicesImageDTO).save();
                ourServicesImage  = Utils.convertModelToObject(ourServicesImage);
                const imgUrl /**String */ = Utils.getImageUrl(req, ourServicesImage);
                ourServicesImage.imgUrl = imgUrl
                return ourServicesImage;
            }
            else{
                // if no about us
                // delete the newly saved image
                console.log("AbOUT TO DELETE")
                await Utils.deleteFile(ourServicesImageDTO.path);
            }
            return null
        }
        catch(ex /**Exception */){
            console.log(ex.Message);
            // delete file that may have been created
            await Utils.deleteFile(ourServicesImageDTO?.path || "");
            return null;
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {ObjectId} _id 
     * @returns {Promise<OurServices>}
     */
    getOurService = async (req, _id /** ObjectId */) /** OurServices */=> {
        try{
            let ourService /**OurServices*/= await OurServices.findOne({_id});
            if(ourService !== null){
                ourService = Utils.convertModelToObject(ourService);

                let image /**OurServicesImage*/ = await this.getOurServicesImage(req, ourService._id);
                if(!image){
                    image = {
                        
                        ourServicesId: ourService._id,
                        imageUrl: null
                    }
                }
                ourService.imgUrl = image.imgUrl; 
                ourService.image = image;
            }
            return ourService;
        } catch(ex /** Exception */){
            // console.log(ex)
            return null;
        }
    }

    /**
     * 
     * @param {Request} req 
     * @returns {Array<OurServicesAndImages>}
     */
    getAllOurServicesAndImages = async (req /** Request */) /** Array<OurServicesAndImages> */=> {
        // get all services
        const ourServices /** Array<OurService> */= await OurServices.find();
        const returnOurServices /** Array<urServicesAndImages> */ = [];
        for(let ourService of ourServices){
            ourService = ourService.toObject()
            
            let image /**OurServicesImage*/ = await this.getOurServicesImage(req, ourService._id);
            if(image === null){
                image = {
                    
                    ourServicesId: ourService._id,
                    imageUrl: null
                }
            }
            
            ourService.image = image
            returnOurServices.push(ourService)
        }
        return returnOurServices;
    }

}

module.exports = {IOurServicesService, OurServicesService, OurServicesDTO, OurServicesImageDTO, OurServicesAndImages}