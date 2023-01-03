const {IIntroService} = require("../services/homepage.intro.service");
const {IStatsService} = require("../services/homepage.stats.service");  
const { IAuthService } = require("../services/auth.service");
const {ICoinRatesService } = require("../services/homepage.coinrates.service");
const { IInvestmentService } = require("../services/investment.service");
const {IHowToEarnService} = require("../services/homepage.howToEarn.service");
const {IReviewService} = require("../services/home.review.service.js");
const {IFooterService, FooterDTO} = require("../services/footer.service.js");
const { IAboutUsService, AboutUsDTO } = require("../services/aboutus.service.js");
const {IOurServicesService, OurServicesDTO, OurServicesImageDTO} = require("../services/aboutus.service.js");
// DTOS
const AboutUsImageDTO = {
    fieldname : String,
    mimeType: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    aboutUsId: String
}
const Stats /** {[key: string] : {[key: string] : string}} */ = {
    stats1: {
        data: String,
        desc: String,
    },
    stats2: {
        data: String,
        desc: String,
    },
    stats3: {
        data: String,
        desc: String,
    },
    stats4: {
        data: String,
        desc: String,
    }
}
const ReviewDTO = {
    imageUrl: String || null,
    name: String,
    gender: ["male", "female"],
    review: String
}


// @Path("home")
class HomeController {
    /**IIntroService */
    introService;
    /** IAuthService */
    authService;
    /**IStatsService */
    statsService
    /**ICoinRatesService */
    coinRatesService

    /**IInvestmentService */
    investmentService

    /** IHowToEarnService */
    howToEarnService

    /**IReviewService */
    reviewService

    /**IFooterService */
    footerService

    /** IAboutUsService */
    aboutUsService

    /** IOurServicesService */
    ourServices
    /**
     * @param {IIntroService} introService 
     * @param {IAuthService} authService
     * @param {IStatsService} statsService
     * @param {ICoinRatesService} coinRateService
     * @param {IInvestmentService} investmentService
     * @param {IHowToEarnService} howToEarnService
     * @param {IReviewService} reviewService
     * @param {IFooterService} footerService
     * @param {IAboutUsService} aboutUsService 
     * @param {IOurServicesService} ourServices
     */
    constructor( 
        introService /**IIntroService */, 
        authService /**IAuthService */, 
        statsService /** IStatsService */,
        coinRateService /**ICoinRatesService */,
        investmentService /**IInvestmentService */,
        howToEarnService /**IHowToEarnService */,
        reviewService /**IReviewService */,
        footerService /**IFooterService */,
        aboutUsService /** IAboutUsService */,
        ourServices /** IOurServicesService */
        ) {

        this.introService = introService;
        this.authService = authService;
        this.statsService = statsService;
        this.coinRatesService = coinRateService
        this.investmentService = investmentService;
        this.howToEarnService = howToEarnService;
        this.reviewService = reviewService;
        this.footerService = footerService;
        this.aboutUsService = aboutUsService;
        this.ourServices = ourServices;
    }

    /** 
     * @method POST /intro
     * @desc Allows only admin upload intro data
     * @protected (userId in req.userId | admin access required)
     * @req {body: {
     *  IntroDTO: {
     *      heading: String,
     *      body: String,
     *      adminWhatsappNum: String
     *   },
     *  file: {
     *   fieldname: String,
     *   mimetype: String,
     *   destination: String,
     *   filename: String,
     *   path: String,
     *   size: Number
     *  }
     * }
     * }
     * }
     * 
     * @returns { Response<Intro> }
    */
    createIntro = async (req /**Request */, res /**Response */)/**ResponseEntity<Intro> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to updload Intro"});

            const {heading /**String */, body /**String */, adminWhatsappNum /** String */} = req.body;
            if(!heading || !body || !adminWhatsappNum){
                return res.status(403).json({error: "Please, include a valid heading, body and whatsapp number"});
            }
            const fileData /**FileSchema  */ = req.file;
            if(!fileData){
                return res.status(403).json({error: "Please, include a valid image"});
            }
            const intro /**Intro */ = await this.introService.createIntro( {heading, body, adminWhatsappNum}, fileData, req);
            // console.log("This is the intro", intro);
            return res.status(201).json({intro});
        } catch(ex /**Message */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
    }

    /**
     *  @method POST /stats
     *  @desc Allows only admin upload stats data
     *  @protected (userId in req.userId | admin access required)
     *  @param {{body: Stats}} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<Stats>}
     */
    createStats = async ( req /**Request */, res /**Response */) /**ResponseEntity<Stats> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);

            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to create stats"});
            
            
            const stats /**Stats */ = req.body;
            // console.log(stats)
            if(!stats.stats1 || !stats.stats2 || !stats.stats3 || !stats.stats4){
                return res.status(400).json({stats, error: "Some data missing"})
            }
            const savedStats = await this.statsService.saveOne(stats);
            return res.status(201).json({savedStats});
        }catch(ex /** Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
    }

    /**
      * @method GET /stats
      * @PROTECTED Accessible to all users
     *  @desc Returns the current HomePage Stats Document or null
     *  @returns {Response<{stats: Stats?}>} returns Stats or null
     */
    getStats = async (req /**Request */, res /**Response */) /**Response<> */ => {
        try{
            const stats /**Stats */ = await this.statsService.get();
            return res.status(200).json({stats});
        }catch(ex /**Message */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
    }
        
    /**
      * @method GET /intro
      * @PROTECTED Accessible to all users
     *  @desc Returns the current HomePage Intro Document or null
     *  @returns {Response<Intro, Stats>} returns Intro, with an extra parameter (imgUrl), and Stats
     */
     getIntro = async (req /**Request */, res /**Response */) /**Response<Intro, Stats> */ => {
        try{
            const intro /**Intro */ = await this.introService.getIntro(req);
            const stats /**Stats */ = await this.statsService.get();
            return res.status(200).json({intro, stats});
        } catch(err /**Exception */){
            return res.status(400).json({error: err.message});
        }
     }

     /**
      * @method GET /coins
      * @PROTECTED Accessible to all users
      * @return {CoinRates}
      */
     getCoins = async (req /**Request */, res /**Response */) /**Response<CoinRates> */ => {
        try{
            const response /**CoinRates */ = await this.coinRatesService.retrieveCoins();
            return res.status(200).json(response);
        } catch( ex /**Exception */){
            return res.status(400).json({error: ex.message});
        }
     }


     /**
      * @method GET /investments
      * @PROTECTED Accessible to all users
      * @return {Array<Investment>}
      */
     getInvestments = async (req /**Request */, res /**Response */) /**Response<> */ => {
        try{
            const investments /**Array<Investment>*/ = await this.investmentService.retrieveInvestments();
            return res.status(200).json(investments);
        } catch( ex /**Exception */){ 
            return res.status(400).json({error: ex.message});
            
        }
     }

     /**
     *  @method POST /howtoearnimage
     *  @desc Allows only admin upload images for how to earn
     *  @protected (userId in req.userId | admin access required)
     * 
     *  @param {file: {
     *   fieldname: String,
      *   mimetype: String,
      *   destination: String,
      *   filename: String,
      *   path: String,
      *   size: Number
      *  }} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<>}
     */
     createHowToEarnImage = async (req /**Request */, res /**Response */)/**ResponseEntity<> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            // console.log({isAdmin});
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to upload image"});
            
            const fileData /**FileSchema  */ = req.file;
            if(!fileData){
                return res.status(403).json({error: "Please, include a valid image"});
            }
            await this.howToEarnService.createHowToEarnImage(fileData);
            const howToEarnImage /**HowToEarnImage */ = await this.howToEarnService.getHowToEarnImage(req);
            return res.status(201).json({howToEarnImage});
        } catch(ex /**Message */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

     

      /**
      * @method GET /howtoearnimage
      * @PROTECTED Accessible to all users
      * @return {HowToEarnImage}
      */
     getHowToEarnImage = async (req /**Request */, res /**Response */)/**ResponseEntity<> */ => {
        try{
            const  image = await this.howToEarnService.getHowToEarnImage(req);
            return res.status(200).json({howToEarnImage: image});
        } catch(ex /**Message */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

     /**
     *  @method POST /howtoearn
     *  @desc Allows only admin upload how to earn
     *  @protected (userId in req.userId | admin access required)
     * 
     *  @param {body: {
     *     desc: String,
     *     steps: [{
     *          title: String,
     *          details: String
     *       }]
     * }} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<>}
     */
     createHowToEarn = async  (req /**Request */, res /**Response */)/**ResponseEntity<> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to do this"});

            const {desc /**String */, steps /**Array<{title: String, details: String}> */} = req.body;
            if(!desc || !Array.isArray(steps)){
                return res.status(403).json({error: "Please input valid data"});
            }

            const howToEarn /**HowToEarn */= await this.howToEarnService.createHowToEarn({desc, steps});

            return res.status(201).json({howToEarn})
        } catch(ex /**Message */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }

     }


     /**
      * @method GET /howtoearn
      * @PROTECTED Accessible to all users
      * @return {HowToEarn}
      */
     getHowToEarn = async (req /**Request */, res /**Response */) /**Response<HowToEarn> */ => {
        try{
            const howToEarn /** HowToEarn */ = await this.howToEarnService.getHowToEarn()
            return res.status(200).json({howToEarn});
        } catch(ex /**Message */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }

     }

      /**
      * @method GET /getfullhowtoearn
      * @PROTECTED Accessible to all users
      * @return {{howToEarn: HowToEarn, howToEarnImage: HowToEarnImage}}
      */
     getFullHowToEarn = async (req /**Request */, res /**Response */) /**Response<HowToEarn> */ => {
        try{
            const howToEarn /** HowToEarn */ = await this.howToEarnService.getHowToEarn();
            const howToEarnImage /** HowToEarnImage */ = await this.howToEarnService.getHowToEarnImage(req);

            return res.status(200).json({howToEarn, howToEarnImage});
        } catch(ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

     /**
      * @method POST /addreviews
      *  @desc Allows only admin add reviews
      *  @protected (userId in req.userId | admin access required)
      * @param {{
      *     reviews: Array<ReviewDTO>
      * }} req 
      * @param {*} res 
      * @returns {{review: Array<ReviewDTO>}}
      */
     addReviews = async (req /**Request */, res /** Response*/) /**Response<Review> */ => {
        try{
            // Ensure user is admin
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to do this"});

            const {reviews /** Array<ReviewDTO> */} = req.body;
            if(!Array.isArray(reviews)){
                return res.status(403).json({message: "Please, input valid reviews"})
            }

            const savedReview /**Review */= await this.reviewService.addReviews(reviews);
            return res.status(201).json({review: savedReview});
        } catch( ex /** Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

     /**
      * @method GET /getreviews
      * @PROTECTED Accessible to all users
      * @returns {{review: Array<ReviewDTO>}}
      */
      getReviews = async (req /** Request */, res /**Response */) /** Response<Review */ => {
        try{
            const review /** Review */ = await this.reviewService.getReviews();
            return res.status(200).json(review);
        } catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
      } 


       /**
      * @method POST /footer
      *  @desc Allows only admin create footer
      *  @protected (userId in req.userId | admin access required)
      * @param {{
        *     body: {
        *       footer: FooterDTO
        *     }
        * }} req 
        * @param {{footer: Footer}} res 
        * @returns {{footer: Footer}}
        */
      createFooter = async  (req /**Request */, res /** Response*/) /**Response<Footer> */ => {
             try{
                // Ensure user is admin
                const userId /**ObjectId */ = req.userId;
                const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
                if(!isAdmin)
                    return res.status(403).json({message: "You are not permitted to do this"});

                // Ensure footer has company name
                
                const footerDetails /** FooterDTO */ = req.body.footer;
                if(!footerDetails?.companyName){
                    return res.status(403).json({message: "Please, include the company name."});
                }

                const createdFooter /** Footer */= await this.footerService.createFooter(footerDetails);

                return res.status(201).json({footer: createdFooter});
             }  
             catch( ex /**Exception */){
                // console.log(ex);
                return res.status(400).json({error: ex.message});
            }

      }

      /**
      * @method GET /footer
      * @PROTECTED Accessible to all users
      * @returns {{footer: Response<Footer>}}
      */
      getFooter = async (req /**Request */, res /** Response*/) /**Response<Footer> */ => {
            try{
                const footer /**Footer */ = await this.footerService.getFooter();
                return res.status(200).json({footer});
            } catch( ex /**Exception */){
                // console.log(ex);
                return res.status(400).json({error: ex.message});
            }
      }


    /**
     *  @method POST /aboutus
     *  @desc Allows only admin add aboutus
     *  @protected (userId in req.userId | admin access required)
     *  @param {{body: AboutUsDTO}} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<Stats>} 
     */
     createAboutUs = async ( req /**Request */, res /**Response */) /**ResponseEntity<Stats> */ => {
        try{
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

        catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

     /**
      * @method GET /aboutus
      * @PROTECTED Accessible to all users
      * @returns {{aboutus: AboutUsDTO}}
      */
     getAboutUs = async (req/**Request */, res /**Response */) /**ResponseEntity<AboutUs> */ => {
        try{
            const aboutUs /** AboutUs */ = await this.aboutUsService.getAboutUs();
            return res.status(200).json({aboutUs})
        }
        catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

    

     /**
     *  @method POST /aboutusimage
     *  @desc Allows only admin upload images for about us image
     *  @protected (userId in req.userId | admin access required)
     * 
     *  @param {file: {
      *   fieldname: String,
      *   mimetype: String,
      *   destination: String,
      *   filename: String,
      *   path: String,
      *   size: Number
      *  }, 
      * body{
      *    aboutUsId: ObjectId
      * }} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<>}
     */
    addAboutUsImage = async (req /**Request */, res /**Response */)/**ResponseEntity<> */ => {
       try{
           // Ensure user is admin
           const userId /**ObjectId */ = req.userId;
           const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
           // console.log({isAdmin});
           if(!isAdmin)
               return res.status(403).json({message: "You are not permitted to upload image"});

           // arrange
           const file /** AboutUsImageDTO */ = req.file;
           const { aboutUsId /** ObjectId */} = req.body;
           if(aboutUsId === null){
               return res.status(403).json({message: "Please, include an about us id"});
           }
           console.log({file, body: req.body})
           file.aboutUsId = aboutUsId;

           // act
           const savedImage /** AboutUsImage */=  await this.aboutUsService.addAboutUsImage(file, req);

           return res.status(201).json({aboutUsImage: savedImage });
       }
       catch(ex /** Message */){
           return res.status(400).json({error: ex.message});
       }
    }


     /**
     *  @method GET /aboutusimage/:aboutusid
     *  @desc Allows everyone access aboutusimage
     *  @protected everyone has access
     * */
    getAboutUsImage =  async (req /**Request */, res /**Response */)/**ResponseEntity<> */ => { 

        try{
            // get Id from req

            const aboutusId /**ObjectId*/ = req.params.aboutusid;
            const aboutUsImage = await this.aboutUsService.getAboutUsImage(req, aboutusId);
            return res.status(200).json({aboutUsImage});
        }
        catch(ex /** Message */){
            return res.status(400).json({error: ex.message});
        }
    }

    /**
      * @method GET /aboutusfull
      * @PROTECTED Accessible to all users
      * @returns {{aboutus: AboutUsDTO}}
      */
    getAboutUsFull =  async (req /**Request */, res /**Response */)/**ResponseEntity<> */ => {
        try{
            let aboutUs /** AboutUs */ = await this.aboutUsService.getAboutUs();
            aboutUs.imgUrl = "";
            if(aboutUs !== null){
                const aboutusId /**ObjectId*/ = aboutUs._id;
                const aboutUsImage = await this.aboutUsService.getAboutUsImage(req, aboutusId);
                if (aboutUsImage !== null){
                    aboutUs.imgUrl = aboutUsImage.imgUrl;
                }
            }
            return res.status(200).json({aboutUs})

        }
        catch(ex /** Message */){
            return res.status(400).json({error: ex.message});
        }
    }


    /**
     *  @method POST /ourservices
     *  @desc Allows only admin add ourservices
     *  @protected (userId in req.userId | admin access required)
     *  @param {{body: OurServicesDTO}} req,
     * @returns {Response<Stats>} 
     */
     createOurServices = async ( req /**Request */, res /**Response */) /**ResponseEntity<Stats> */ => {
        try{
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);

            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to create our services"});
            
            const { title /** String */, body /** String */} = req.body;
            if(!title || !body)
                return res.status(401).json({message: "Please, include a title and body"});

            const ourService/** AboutUsDTO */ = await this.ourServices.addOurServices({title, body});

            return res.status(200).json({ourService})
        }
 
        catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }



     /**
      * @method GET /ourservices
      * @PROTECTED Accessible to all users
      * @returns {Promise<{ourServices: Array<OurServices>}>}
      */
      getOurServices = async (req/**Request */, res /**Response */) /**ResponseEntity<AboutUs> */ => {
        try{
            const ourServices /** Array<OurServicesAndImages>*/ = await this.ourServices.getAllOurServicesAndImages(req);
            return res.status(200).json({ourServices});
        }
        catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }

      /**
      * @method GET /ourservices/:ourserviceid
      * @PROTECTED Accessible to all users
      * @returns {Promise<{ourService: OurService}>}
      */
       getOurService = async (req/**Request */, res /**Response */) /**ResponseEntity<AboutUs> */ => {
        try{
            const _id /** ObjectId */ = req.params.ourserviceid;
            const ourService /** Array<OurServicesAndImages>*/ = await this.ourServices.getOurService(req, _id);

            return res.status(200).json({ourService});
        }
        catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }



     /**
      * @method PATCH /ourservices/:ourserviceid
      * @PROTECTED  Allows only admin update ourservices
      * @param {{body: OurServicesDTO}} req,
      * @returns {Promise<{ourServices: Array<>}>}
      */
      updateOurServices = async (req/**Request */, res /**Response */) /**ResponseEntity<AboutUs> */ => {
        try{
            const userId /**ObjectId */ = req.userId;
            const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);

            if(!isAdmin)
                return res.status(403).json({message: "You are not permitted to create our services"});

            const id /** ObjectId */ = req.params.ourserviceid
            const ourService /** Array<OurServicesAndImages>*/ = await this.ourServices.updateOurService(id, req.body);
            return res.status(200).json({ourService});
        }
        catch( ex /**Exception */){
            // console.log(ex);
            return res.status(400).json({error: ex.message});
        }
     }


     /**
     *  @method POST /ourservicesimage
     *  @desc Allows only admin upload images for ourservices image
     *  @protected (userId in req.userId | admin access required)
     * 
     *  @param {file: {
      *   fieldname: String,
      *   mimetype: String,
      *   destination: String,
      *   filename: String,
      *   path: String,
      *   size: Number
      *  }, 
      * body{
      *    ourServicesId: ObjectId
      * }} req,
     *  @param {{status: Stats}} res, 
     * @returns {Response<>}
     */
    addOurServicesImage = async (req /**Request */, res /**Response */)/**ResponseEntity<> */ => {
       try{
           // Ensure user is admin
           const userId /**ObjectId */ = req.userId;
           const isAdmin /*boolean*/ = await this.authService.verifyIsAdminFromId(userId);
           // console.log({isAdmin});
           if(!isAdmin)
               return res.status(403).json({message: "You are not permitted to upload image"});

           // arrange
           const file /** OurServicesImageDTO */ = req.file;
           const { ourServicesId /** ObjectId */} = req.body;
           if(ourServicesId === null){
               return res.status(403).json({message: "Please, include an ourServices id"});
           }
           console.log({file, body: req.body})
           file.ourServicesId = ourServicesId;

           // act
           const savedImage /** OurServicesImage */=  await this.ourServices.addOurServicesImage(file, req);
           console.log({savedImage});
           return res.status(201).json({ourServicesImage: savedImage });
       }
       catch(ex /** Message */){
           return res.status(400).json({error: ex.message});
       }
    }


}

module.exports = {HomeController};