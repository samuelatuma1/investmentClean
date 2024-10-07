const {File} = require("../models/file.model.js");
const cloudinary = require('cloudinary').v2

const { ConfigurationSettings } = require("../config.js");
const processEnv = ConfigurationSettings.getEnv();
const fs /**fs */ = require('node:fs/promises');
            
class IFileService {
    createFile = async (fileSchema /**FileSchema */) /**File */=> {}
    /**
     * @desc saves file
     * @param {FileSchema} fileSchema 
     * @returns {Promise<FileSchema>}
     */
    saveFile = async (fileSchema /**FileSchema */) /**FileSchema */=> {
     }
}

class FileSchema {
    
        /**String */
        fieldname
        /**String */
        mimetype
        /** String */
        destination
        /** String */
        filename
        /** String */
        path
        /** Number */
        size
      
}
class FileService extends IFileService{

    constructor(){
        super()
        cloudinary.config({
            cloud_name: processEnv.CLOUD_NAME,
            api_key: processEnv.API_KEY,
            api_secret: processEnv.API_SECRET,
            secure: true
          });
    }
    /**
     * @desc saves file
     * @param {FileSchema} fileSchema 
     * @returns {Promise<File>}
     */
     createFile = async (fileSchema /**FileSchema */) /**File */=> {
        try{
            let kwargs = {resource_type: fileSchema.mimetype}
     
            const response = await cloudinary.uploader.upload(fileSchema.path, kwargs)
            
            fileSchema = new File({...fileSchema, path: response.secure_url})
            console.log({fileSchema, response})
            const fileToSave /**File */ = new File(fileSchema);
            return await fileToSave.save();
        } catch (ex /**Exception */){
            return null;
        }
     }

     /**
     * @desc saves file
     * @param {FileSchema} fileSchema 
     * @returns {Promise<FileSchema>}
     */
     saveFile = async (fileSchema /**FileSchema */) /**File */=> {
        try{
            console.log({cloudName: processEnv.CLOUD_NAME})
            let filePath = ({...fileSchema}).path + '';
            let kwargs = {resource_type: "image"}
            const response = await cloudinary.uploader.upload(fileSchema.path, kwargs)
            console.log({response})

            fileSchema = {...fileSchema, path: response.secure_url}
            try{
                await fs.unlink(filePath);
            }catch(ex){
                console.log({ex})
            }
            console.log({fileSchema, response})
            return fileSchema
        } catch (ex /**Exception */){
            console.log({ex})
            return null;
        }
     }
}

module.exports = {IFileService, FileService};