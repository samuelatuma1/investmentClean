const {Footer} = require("../models/footer.model.js");


const FooterDTO = {
    companyName: String,
    about: String,
    address: String,
    email: String,
    phone: String,
    twitter: String,
    facebook: String
}

class IFooterService {
    /**
     * @desc stores footer in db. Ensures only one footer is stored in the db
     * @param {FooterDTO} footer 
     * @returns {Promise<Footer>}
     */
     createFooter = async (footer /**FooterDTO */ ) /**Footer */ => {}

    /**
     * @returns {Promise<Footer>}
     */
    getFooter = async () => {}
}

class FooterService extends IFooterService{
    /**
     * @desc Checks if a footer exists in DB.
     * @returns {boolean} 
     */
    #checkFooterExists = async () => {
        const footer /**Footer */ = await Footer.findOne();
        return footer === null ? false : true;
    }

    /**
     * @desc stores footer in db. Ensures only one footer is stored in the db
     * @param {FooterDTO} footer 
     * @returns {Promise<Footer>}}
     */
    createFooter = async (footer /**FooterDTO */ ) /**Footer */ => {
        /** Check if footer exists */
        const footerExists /**boolean */ = this.#checkFooterExists();
        if(footerExists){
            await Footer.deleteOne();
        }
        const footerToSave /** Footer */ = new Footer(footer);
        return await footerToSave.save();
    }


    /**
     * @returns {Promise<Footer>}
     */
    getFooter = async () => {
        return await Footer.findOne();
    }
}

module.exports = {FooterService, IFooterService, FooterDTO};