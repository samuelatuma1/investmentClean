const nodemailer = require("nodemailer")
const crypto = require("crypto")
const {JWTService} = require("./jwt.service.js")

/**
 * 
 * @param {String} mailBody 
 * @returns {String}
 */
function craftMailTemplate(mailBody /** String */) /** String */{

 return `
 <body style=" box-sizing: border-box;margin: 0;font-family: Verdana, Geneva, Tahoma, sans-serif;">
 <div>
     <style>
         body{
             box-sizing: border-box;
             margin: 0;
             font-family: Verdana, Geneva, Tahoma, sans-serif;

         }
         
     
         .footerDiv{
             padding: 20px 10px;
             top: 0px;
             left: 0px;
             color: grey;
             background-color: black;
         }
 
         .footerGridDiv h2{ 
             padding-bottom: 12px;
         }
 
         .footerGridDiv section {
             padding: 18px 10px;
         }
 
 
         .adminLink{
             text-decoration: none;
             color: inherit;
             display: inline-block
         }
         .footerDiv .contact a{
             text-decoration: none;
             color: black;
             display: block;
             transition: 0.5s linear;
             padding-bottom: 10px;
             color: inherit;
         }
         .footerDiv .contact a:hover{
             text-decoration: underline;
         }
         @media screen and (min-width: 767px){
             .footerGridDiv{
                 display: grid;
                 grid-template-columns: 40% 20% 20% 20%;
                 justify-content: space-evenly;
             }
 
             .footerGridDiv section {
                 font-size: medium;
                 border-bottom: 1px solid transparent;
             }
 
             .footerDiv{
                 display: flex;
                 align-items: center;
             }
         }
         @media screen and (max-width: 767px){
             .footerGridDiv{
                 display: grid;
                 grid-template-columns: 100%;
                 justify-content: space-evenly;
             }
 
             
         }
         .heading{
             color: grey;
             box-shadow: 0px 0px 10px 0px rgb(222, 222, 222);
             border-radius: 20px;
             padding: 10px;
         }
         .main{
             max-width: 600px;
             margin: auto;
         }
     </style>
     <div class="main" style="max-width: 600px; margin: auto;">
     <div class="heading" style="color: grey;
                box-shadow: 0px 0px 10px 0px rgb(222, 222, 222);
                border-radius: 20px;
                padding: 10px;">
         <h1 style="display: flex; justify-content: center; align-items: center; color: orange;">
             <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="2em" width="2em" ><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
         </h1>
         <h1 style="display: flex; justify-content: center; align-items: center;">
             HighFx Dream Investment
             
         </h1>
         <p style="text-align: center">
             Our investments forever for better.
         </p>
     </div>
     <div style="display: flex; align-items: center; min-height: 250px;">
         ${mailBody}
     </div>
     </div>
 <br>
 <div class="footerDiv style="padding: 20px 10px; top: 0px; left: 0px; color: grey; background-color: black; background: black;">
     <div class="footerGridDiv">
        
         <section style="padding: 18px 10px;">
             <h4>About</h4><br>
             <p>Founded in 2010 in Amsterdam, ETQ derived under the mindset of eliminating over-accessorized branding and focusing primarily on letting the quality of the   product speak for itself. Read more</p><br></section><section class="address"><h4>Address</h4><br><p style="width: 50%;">Duinkerkenstraat 3A9723 BN Groningen The Netherlands
             </p>
         </section>
         <section class="contact"><h4>Contact</h4><br>
            <p>
                <a target="_blank" style="text-decoration: none;
                color: black;
                display: block;
                transition: 0.5s linear;
                padding-bottom: 10px;
                color: inherit;">Send email</a></p><p>

                <a style="text-decoration: none;
                color: black;
                display: block;
                transition: 0.5s linear;
                padding-bottom: 10px;
                color: inherit;">
                Call +1 (0) 555 460 128</a>
            </p>
         </section><section class="address">
             <h2 style="padding-bottom: 12px;>Invest</h2>
         <a class="adminLink" style="text-decoration: none; color: inherit; display: inline-block">
             <p style="display: flex; align-items: center;">
                 Copyright &nbsp;
                 <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" >
             <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"></path>
             </svg>2023 | Invest
             </p>
         </a>
         <p>All rights reserved.</p>
     </section></div>
 </div>
 
 </div>
</body>
`

 }
class IMailService {
    /**
     * @desc sends mail to "to"
     * @param {string} to 
     * @param {string} subject 
     * @param {string<html or text>} html 
     */
    sendMail = async (to /**: string */, subject /**string */, html /**{string<html or text>} */) /**void */ => {
        throw new Error("Send Mail not implemented")
    }

    /**
     * @desc sends verification mail to savedUser's email
     * @param {Request} req 
     * @param {User} savedUser 
     */
    sendVerificationMail = async (req /**Request */, savedUser /**User */) /**void */ => {
        throw new Error("sendVerificationMail not implemented");
    }
}
class Mail{
    /**
     * @desc instantiates mail data
     * @param service : Mail service Provide
     * @param email_username : Sender email address 
     * @param email
     */
    constructor(service, email_username, email_password){
        this.service = service
        this.email_username = email_username,
        this.email_password = email_password

    }
    createTransport = () => {
        return nodemailer.createTransport({
            service: this.service,
            auth: {
                user: this.email_username,
                pass: this.email_password
            }
        })
    }

    /**
     * 
     * @param {Email} to 
     * @param {String} subject 
     * @param {HTML} html 
     * @returns {SMTPTransport.SentMessageInfo}
     */
    sendMail = async (to, subject, html) => {
        try{
            const transporter = this.createTransport()
            const mailBody = craftMailTemplate(html)

            const mailRequest = await transporter.sendMail({from: this.email_username, to, subject, html: mailBody})
            // console.log(mailRequest)
            console.log(mailBody)
            return mailRequest
        } catch(err){
            return {error: "An error occured while sending mail"+ `Mail to ${to} not sent`}
        }
    }

    sendVerificationMail = async (req, savedUser) => {
       
        try{
            const to = savedUser.email
            const fullName = savedUser.fullName || "there"

            const signedToken = JWTService.signToken({email: to}, process.env.JWT_KEY,
                (60 * 60 * 5))
            const verificationUrl = req.protocol + '://' + req.get('host') 
                + "/auth/verifyMail" + "/" + signedToken
        
            const verificationMail = `
                    <div style="font-family: verdana sans-serif;">
                        <h3>Hello ${fullName}</h3>
                        <p>Please confirm your email by clicking the button below.</p>

                        <button style="background: teal; color: white; border: 0px solid teal; 
                            border-radius: 5px; padding: 10px;">
                                <a href="${verificationUrl}" style="color: inherit;
                                text-decoration: none;">Verify</a>
                            </button>
                        <p>Didn't sign up for our mail, Please email us at ...</p>
                    </div>
                `    
                const sendMail = await this.sendMail(to, "Verify Email", verificationMail)
                return sendMail
        } catch(err){
            // console.log(err)
            throw new Error("Email verification failed")
        }
    }

}

module.exports = {Mail, IMailService}