const multer = require("multer")
const path = require("path")

// Configure file destination and filename
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        // Set destination for files, starting at base folder
        const dest = 'media/'
        return callBack(null, dest)
    },
    filename: (req, file, callBack) => {
        // Set name for file when stored in destination
        // Get mimetype (To extract file extension from it)
            // Example mimetype => "image/png"
        const extension = file.mimetype.split("/")[1]
        const fileName = `houseUpload-${Date.now()}-${Math.floor(Math.random() * 10000000000)}.${extension}`
        return callBack(null, fileName)
    }
})

/**
 * @desc limits fileSize to 20MB
 */
const limits = {
    fileSize: 20000000
}

/**
 * @desc Filters file submitted to accept only extensions [".jpg", ".jpeg", ".png", ".gif"]
 */
const fileFilter = (req, file, callBack) => {
    const acceptedTypes = [".jpg", ".jpeg", ".png", ".gif"]
    const fileType = path.extname(file.originalname)
    const acceptFile = acceptedTypes.includes(fileType.toLowerCase())
    if(acceptFile) {
        return callBack(null, true)
    }
    return callBack(new Error("Invalid file type: " + fileType))
}
/**
 * @desc Stores images in 'media/', rename files to avoid name conflict,
 *  ensures file is of type image
 * @fileSizeLimit :-> File size is limited to 20MB
 */
const uploadImg = multer({storage, limits, fileFilter})

class UploadImage {
    storage = (filePath /**: String */ = "" ) => {
        return multer.diskStorage({
            destination: (req, file, callBack) => {
                // Set destination for files, starting at base folder
                const dest = `media/${filePath}`;
                return callBack(null, dest)
            },
            filename: (req, file, callBack) => {
                // Set name for file when stored in destination
                // Get mimetype (To extract file extension from it)
                    // Example mimetype => "image/png"
                const extension = file.mimetype.split("/")[1]
                const fileName = `image-${Date.now()}-${Math.floor(Math.random() * 10000000000)}.${extension}`
                return callBack(null, fileName)
            }
        })
    }

    /**
     * 
     * @param {number} size 
     * @returns {{fileSize: number}}
     */
    limits = (size /**number */ = 20000000) => {
        return {
            fileSize: size
        }
    }

    /**
     * @param {Array<string>} accepted the accepted extensions. default [".jpg", ".jpeg", ".png", ".gif"]
     * @returns 
     */
    fileFilter = (accepted /**Array<string> */= [".jpg", ".jpeg", ".png", ".gif", ".svg"]) => {
        return (req, file, callBack) => {
            const acceptedTypes = accepted
            const fileType = path.extname(file.originalname)
            const acceptFile = acceptedTypes.includes(fileType.toLowerCase())
            if(acceptFile) {
                return callBack(null, true)
            }
            return callBack(new Error("Invalid file type: " + fileType))
        }
    }

    /**
     * @desc uploads file
     * @exampleUseage new UploadImage().uploadImg().single("fileName")
     * @param {string} filePath: Path to the resource default = "media"
     * @param {number} fileSizeLimit The maximim size of the file (bytes) default = 20000000
     * @param {Array<string>} accepted accepted extensions. default [".jpg", ".jpeg", ".png", ".gif"]
     * @returns 
     */
    uploadImg = (filePath /**string */ = "", fileSizeLimit /**number */ =  20000000, accepted = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".avif", ".svg", ".webp"]) => {
        return multer({
            storage:  this.storage(filePath), 
            limits: this.limits(fileSizeLimit), 
            fileFilter: this.fileFilter(accepted)
        });
    }
}


module.exports = {uploadImg, UploadImage}