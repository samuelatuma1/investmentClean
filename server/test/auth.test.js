const mocha = require("mocha")
const chai = require("chai")
const chaiHttp = require("chai-http")


const {app} = require("../index.js")
// Cleearing ModelData 
const {User} = require("../models/auth.model.js")
chai.use(chaiHttp)

const should = chai.should()



describe("Auth", function(){
    before(async function(){
        const delCount = await User.deleteMany({email : new RegExp("Test", "i")})
        console.log({delCount})
    })

    describe("/auth/signup POST", function(){
        const newUser = {
            "email": "TestSam@mail.com",
            "password": "12345A!",
            "retypePassword": "12345A!"
        }
        it(" should return status code 201 for a new unsaved uer", 
        function(done){
            chai.request(app)
            .post("/auth/signup")
            .send(newUser)
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(201)
                const resData = res.body
                resData.savedUser.should.have.property("email")
                resData.savedUser.should.have.property("_id")
                done()
            })
        })
    })


})
