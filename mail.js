const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "llousvamel11@gmail.com",
        pass: "awwhetnpkykycupq"
    }
}
)

const mail = {
    from : "llousvamel11@gmail.com",
    to: "atumasaake@gmail.com, samuelatuma@gmail.com",
    subject: "Sending my first mail",
    html: `
        <h1>Dear John</h1>
        <p style="background-color: yellow;">
            Oh How I hate to write
        </p>
    `
}

class Mail{
    constructor(service, email_username, email_password){
        this.service = service
        this.email_username = email_username,
        this.email_password = email_password
    }
    createTransport(){
        return nodemailer.createTransport({
            service: this.service,
            auth: {
                user: this.email_username,
                pass: this.email_password
            }
        })
    }
    async sendMail(from, to, subject, html){
        try{
            const transporter = this.createTransport()
            const mailRequest = await transporter.sendMail({from, to, subject, html})
            console.log({mailRequest})
        } catch(err){
            console.log(err);
            return {error: "An error occured while sending mail"+ `Mail to ${to} not sent`}
        }
    }
}

const sendMailContent = `
<html>
    <body style="font-family: verdana sans-serif;">
        <style>
            
            a{
                color: inherit;
                text-decoration: none;
            }
        </style>
        <p>Hello XYZ</p>
        <p>Please confirm your email by clicking the button below.
            <br>
            <button style="background: teal; color: white; border: 0px solid teal; 
            border-radius: 5px; padding: 10px;">
                <a href="" style="color: inherit;
                text-decoration: none;">Verify</a>
            </button>
        </p>
    </body>

</html>`

const newMail = new Mail("gmail", "llousvamel11@gmail.com", "awwhetnpkykycupq")
newMail.sendMail("llousvamel11@gmail.com", "atumasaake@gmail.com", "Verify Email", sendMailContent)