const {File} = require("../models/file.model.js");

class IFileService {
    createFile = async (fileSchema /**FileSchema */) /**File */=> {}
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

    /**
     * @desc saves file
     * @param {FileSchema} fileSchema 
     * @returns {Promise<File>}
     */
     createFile = async (fileSchema /**FileSchema */) /**File */=> {
        try{
            const fileToSave /**File */ = new File(fileSchema);
            return await fileToSave.save();
        } catch (ex /**Exception */){
            return null;
        }
     }
}

module.exports = {IFileService, FileService};