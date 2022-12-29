const { IAboutUsService, AboutUsDTO, AboutUsService } = require("../services/aboutus.service");
const { IAuthService } = require("../services/auth.service");


class AboutController{

    /**
     * 
     * @param {IAboutUsService} aboutUsService 
     * @param {IAuthService} authService 
     */
    constructor(aboutUsService /**IAboutUsService */, authService /** IAuthService */){
        this.aboutUsService = aboutUsService;
        this.authService = authService;
    }
    /**
     *  @method POST /aboutus
     *  @desc Allows only admin add aboutus
     *  @protected (userId in req.userId | admin access required)
     *  @param {{body: AboutUsDTO}} req,
     * @returns {Response<Stats>} 
     */
     createAboutUs = async ( req /**Request */, res /**Response */) /**ResponseEntity<Stats> */ => {
        const userId /**ObjectId */ = req.userId;
        const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);

        if(!isAdmin)
            return res.status(403).json({message: "You are not permitted to create about us"});
        
        const { title /** String */, body /** String */} = req.body;
        
        if(!title || !body)
            return res.status(401).json({message: "Please, include a title and body"});

        const createdAboutUs/** AboutUsDTO */ = await this.aboutUsService.addAboutUs({title, body});

        return res.status(200).json({aboutUs: createdAboutUs})
     }
    
}