// Imports
// states
import { useState, useEffect } from "react";

// Static files
import imgBg from "../../static/home/img.svg";
import ourservicedefaultimg from "../../static/service.png";
import avatar from "../../static/home/avatar.svg";


import NavigationBar from "../../components/navigation";
import { Loading } from "../../components/loading";
import {HiCurrencyDollar} from "react-icons/hi";

// Icons
import {FaArrowUp} from "react-icons/fa";
import { GrLineChart} from "react-icons/gr"
import {BiDotsHorizontalRounded, BiLineChart} from "react-icons/bi";
import {BsFillCalendar2CheckFill, BsShield, BsBrightnessHigh, BsBoxArrowDown, BsBriefcase} from "react-icons/bs";
import {RiFocus2Fill} from "react-icons/ri"
import {AiFillStar, AiOutlineArrowRight} from "react-icons/ai";

// Icon Generator
import { GetIcon } from "../../components/GetIcon";
// Navigation
import {Link} from "react-router-dom";

// Footer
import { Footer } from "../../components/footer";

// Utilities
import { Utilities } from "../../general/utilities";

// icons
import {FaUserAlt, FaChevronCircleRight} from "react-icons/fa";
import {BsFillChatLeftTextFill, BsFillCircleFill} from "react-icons/bs"

// style
import "../css/home.css";
// Styles
const homePageBgImg /** {[Key: String]: string} */ = {
    // backgroundImage: `url(${homePageBackgroundIntroImg})`,
    backgroundSize: "contain",
    minHeight: "350px"

}

const bgStyle /**Object<String, String> */= {
    backgroundImage: `url(${imgBg})`, // SVG Background
    backgroundSize: "contain",
    minHeight: "250px",
    backgroundcolor: "white"
    
}


const HomePageIntro = (props /** {[key: string]: any} */) /**Component */ => {
    // Get Intro details
    // variables
    const signUpUrl = "/auth/signup"
    const whatsappURLBase /** URL */= "https://wa.me/";
    // States
    const [intro /**{[key: string]: string} */, setIntro /**Funct<T, T> */] = useState({
            heading: "Visual Studio 2022 for Mac Blog Posts",
            body: "The Visual Studio Blog is the official source of product insight from the Visual Studio Engineering Team. You can find in-depth information about the Visual Studio 2022 for Mac releases in the following posts:",
            imgUrl: "",
            adminWhatsappNum: ""
    })

    const [stats /**Array<{data: String, desc: String}> */, setStats /**Funct<T, T> */] = useState([]);
    const [loading, setLoading] = useState(false);

    const flattenStats = (stats /**{[key: string]: {data: String, desc: String}} */) /** Array<{data: String, desc: String}>*/ => {
        const flattenedStats /**Array<{data: String, desc: String}> */ = [];
        for(let statKey /**String */ in stats){
            const statVal /**{data: String, desc: String} */ = stats[statKey];
            flattenedStats.push(statVal);
        }
        return flattenedStats;
    }
    // Effects
    useEffect(() => {
        fetchIntro();
    }, [])
    const fetchIntro = async () /**void */ => {
        setLoading(true);
        const introReq /**Request */ = await fetch("/home/intro");
        if(introReq.ok){
            setLoading(false);
            const introRes /**Intro */ = await introReq.json();
            if(introRes.intro){
                setIntro(prevIntro => introRes.intro);
                const statsValues /**Array<{data: String, desc: String}> */ = flattenStats(introRes.stats);
                setStats(statsValues);
            }
        }
    }
    return (
    <>
        <div className="homePageIntroDiv" style={homePageBgImg}>
            {
                loading ? <Loading /> : 
                <section  >
                    <div className="introTextDiv">
                        <h1>{intro?.heading}</h1>

                        <main >
                            
                            <p>
                            {intro?.body}
                            </p>
                            
                            <div className="authBtns">
                                <Link to={signUpUrl}>
                                    <button className="authBtnSignUp">
                                            <FaUserAlt /> Sign up with Email
                                    </button>
                                </Link>

                                <a href={`${whatsappURLBase}${intro?.adminWhatsappNum}`}>
                                    <button className="authBtnSignUp">
                                        
                                            <BsFillChatLeftTextFill /> Chat with Representative
                                        
                                    </button>
                                </a>
                            </div>
                        </main>


                    </div>

                    <div className="introImgDiv">
                        {
                            intro.imgUrl ? 
                            <img 
                            crossOrigin="anonymous" 
                            src={intro.imgUrl}/>: <div></div>
                        }
                    </div>

                    

                </section>

                
            }
            <section className="statsDiv">
                        {
                            stats.map(stat => (
                                <section>
                                    <h3>{stat.data}</h3>
                                    <p>{stat.desc}</p>
                                </section>
                            ))
                        }
            </section>
        </div>
    </>)
}
const coinsDTO = {
    "id": String,
    "symbol": String,
    "current_price": Number,
    "market_cap_change_percentage_24h": Number,
    "image": String,
    "name": String,
    "_id": String
  }
const CoinsRate /**Component */ = (props /** {[key: string]: any} */) /** JSX */ => {
    // States
    const [loading /**boolean */, setLoading /**Funct<T, T> */] = useState(false);
    const [coins /**Array<coinsDTO> */, setCoins /**Funct<T, T> */] = useState([]);

    // Effects
    useEffect(() => {
        getCoins();
    }, []);
    async function getCoins(){
        setLoading(true);
        const coinsRequest /**Request*/ = await fetch("/home/coins");
        setLoading(false);
        if(coinsRequest.ok){
            const coinsResp /** {coins: Object, _id: String} */ = await coinsRequest.json()
            setCoins(coinsResp.coins);
        }
    }
    
    return (
        <>
            {
            loading ?
            <Loading /> : 
            <div className="coinRatesDiv" style={bgStyle}>
                <h2>Exchange Rates</h2>
                <div className="coinRates" >
                    {coins.length > 0 ? <header>
                        <p>Name</p>
                        <p >Current Price</p>
                        <p>24h Change</p>
                    </header>: <></>}
                    {
                        coins.map((coin /** coinsDTO */ , idx /**Number */)=> (
                            <section className="coinRateSection" key={idx}>
                                <main>
                                    <img
                                    src={coin.image} alt={coin.symbol} />
                                    <span>
                                        {coin.id.charAt(0).toUpperCase() + coin.id.slice(1)}
                                     </span>
                                    <span style={{color: "grey"}}> {coin.symbol.toUpperCase()}</span>
                                </main>
                                <main className="teal" style={{textAlign: "end"}}>
                                    <span>
                                    {coin.current_price.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    })}
                                    </span>
                                </main>
                                <main >
                                    {
                                        
                                        <span style={{color: 
                                            coin.market_cap_change_percentage_24h > 0 ? "green": "maroon"}}>
                                            {coin.market_cap_change_percentage_24h.toFixed(2)}%</span>
                                    }
                                </main>
                            </section>
                        ))
                    }
                </div>
            </div>
            }
        </>
    )
}


const HowToEarn /** Component */ = (props /** {[key: String]: any} */) => {
    // States
    const [loading /**boolean */, setLoading] = useState(true);
    const [howToEarn /** {howToEarn : {desc : String, steps: [{}]}, howToEarnImage: {imgUrl: String}} */, setHowToEarn] = useState({howToEarn: null, howToEarnImage: null});

    // Effects
    useEffect(() => {
        getfullhowtoearn()
    }, [])
    async function getfullhowtoearn() /**void */{
        setLoading(true);
        const getFullHowToEarnReq /** Response */ = await fetch("/home/getfullhowtoearn");
        setLoading(false);
        if(getFullHowToEarnReq.ok){
            const resp /** howToEarn */ = await getFullHowToEarnReq.json();
            setHowToEarn(resp);
        }
    }

    return (
        <>
        {
            loading ?
            <Loading /> :
            <div className="howToEarnDiv">
                <header>
                    <h2 style={{textAlign: "center"}}>
                        {howToEarn?.howToEarn?.desc}
                        
                    </h2>
                    <p
                    style={{
                        width: "70px",
                        height: "1px",
                        margin: "20px auto",
                        borderBottom: "2px solid #f5a623"
                    }}
                    ></p>
                </header>

                <section className="howToEarnSection">
                    <div className="howToEarnImage">
                        {
                            howToEarn?.howToEarnImage?.imgUrl ?
                            <img crossOrigin="anonymous" src={howToEarn.howToEarnImage.imgUrl } /> : 
                            <></>
                        }
                    </div>
                    <main className="howToEarnMain">
                        
                        {howToEarn?.howToEarn?.steps.map(({title, details}, id) => (
                            <div key={id} className="howToEarnAndIcon">
                                <section>
                                    {GetIcon(id)}
                                </section>
                                <section>
                                    <h4>{title}</h4>
                                    <p>{details}</p>
                                </section>
                            </div>
                        ))}
                    </main>
                </section>
            </div>
        }
        </>
    )
}
const OurServicesDTO = {
    _id: "",
    title: "",
    body: "",
    image: {
        _id: "",
        imgUrl: ""
    }
}
const OurServices /** Component */= () /** JSX.Element */ => {
    // States
    const [ourServices, setOurServices] = useState/**<Array<OurServiceDTO>>*/([]);
    const [loading, setLoading] = useState/**<boolean>*/(false);

    //Effects
    useEffect(() => {
        getOurServices();
    }, [])
    async function getOurServices(){
        
        const ourServicesRequest /**Response*/ = await fetch("/home/ourservices");
        
        if(ourServicesRequest.ok){
            const ourServicesResponse /**Array<OurServiceDTO> */ = (await ourServicesRequest.json()).ourServices;
            setOurServices(ourServicesResponse);
        }
    }
    return(
        
            loading ? 
            <Loading /> : 
            <div className="ourServices">
                {
                    ourServices.length > 0 ? 
                    <div>
                        <h2 style={{textAlign: 'center'}}>Our Services</h2>
                        <main className="homeOurServiceMain">
                            {
                                ourServices.map((service, idx) => (
                                    <section key={idx} className="homeOurServiceSection">
                                        <div>
                                            <h3>{service?.title}</h3>
                                            <p>
                                                <div  dangerouslySetInnerHTML={{__html: Utilities.showXWords(service?.body || "", 25)}} />
                                                <Link to={`/ourservice/${service?._id}`} style={{textDecoration: "none"}}>
                                                    <span style={{display: 'inline-flex', 
                                                    alignItems: 'center',
                                                    color: "#f5a623",
                                                    
                                                    fontWeight: "bold"
                                                    }}>
                                                         . . .Read More <AiOutlineArrowRight />
                                                    </span>
                                                </Link>
                                            </p>
                                        </div>
                                        <div className="ourServiceImgDiv">
                                            {
                                                service?.image?.imgUrl ?
                                                <img crossOrigin="anonymous"
                                                src={service.image.imgUrl} alt="service"
                                                />:
                                                <img  crossOrigin="anonymous"
                                                src={ourservicedefaultimg} alt="service"
                                                />
                                            }
                                        </div>
                                    </section>
                                ))
                            }
                        </main>
                    </div> :
                    <></>
                }
            </div>
    )
}


const Investments /**Component */ = (props /** {[key: String]: any} */)/** JSX.Element */ => {
    // States
    const [loading /**boolean */, setLoading /**Funct<T, T> */] = useState(false);
    const [investments /**Array<Investment> */, setInvestments /**Funct<T, T> */] = useState([]);

    // Events
    useEffect(() => {
        getInvestments();
    }, [])
    async function getInvestments() /**void */{
        setLoading(true);
        const req /**Request*/ = await fetch("/home/investments");

        setLoading(false);
        if(req.ok){
           let investments /**Array<Investment> */ = await req.json();

           

           if(investments){
            setInvestments(investments);
           }
        }
    }

    return (
        <>
            {
                loading ? <Loading /> :
                <div className="investmentsHomeDiv">
                    <h2>Start earning now!</h2>
                    <div className="investmentsHomeDiv" style={bgStyle}>
                    
                    {
                        investments.map((investment, idx) => (
                            <div className="investmentCardDiv" key={investment._id}>
                                <section className="headerSection">
                                    <h4>{investment.desc}</h4>
                                </section>
                                
                                <section className="investmentDetails">
                                    <section>
                                        <h5>
                                            Minimum Amount
                                            <HiCurrencyDollar />
                                        </h5>
                                        <h3>
                                            {investment.amount.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                })}
                                        </h3>
                                    </section>

                                    <section>
                                        <h5>
                                            Percent Return 
                                            <FaArrowUp />
                                        </h5>
                                        <h3> 
                                            { investment.yieldValue}%  
                                        </h3>
                                    </section>
                                </section>

                                <section className="waitPeriod">
                                        <h5>
                                            Maximum wait Period 
                                            <BsFillCalendar2CheckFill />
                                        </h5>
                                        <h3> 
                                            { investment.waitPeriod} days
                                        </h3>
                                </section>

                                <section className="investmentSectionBtn">
                                    <a href="./acct/home">
                                        <button>
                                                Start Earning
                                                <GrLineChart />
                                        </button>
                                    </a>
                                </section>
                            </div>
                        ))
                    }
                </div>
                </div>
            }
        </>
    )
}

const ReviewDTO = {
    imageUrl: String || null,
    name: String,
    gender: ["male","female"],
    rating: Number,
    review: String,
    country: String
}
const Reviews /** Component */ = (props /** {[key: String]: any} */) /** JSX.Element */ => {
    // states
    const [loading /**boolean */,  setLoading /** Funct<T, T> */] = useState(false);
    const [reviews /**Array<ReviewDTO> */, setReviews /**Funct<T, T> */] =useState([]);
    
    
    // Effects
    useEffect(() => {
        getreviews()
    }, [])
    async function getreviews(){
        setLoading(true)
        const reviewsReq /** Response */ = await fetch("/home/getreviews");
        setLoading(false);
        if(reviewsReq.ok){
            const reviewsResponse /**{reviews: Array<ReviewDTO>}*/ = await reviewsReq.json()
            if(reviewsResponse){
                setReviews(reviewsResponse.reviews);
            }
        }
    
    }

    const starStyle /** {[Key: String]: String} */ = {
        color: "gold"
    }
    return (
        <div className="homeReviewDiv">
            <h2 style={{textAlign: "center"}}>Reviews</h2>
            {
                loading ? <Loading />: 
                (<div className="reviewListDiv">
                    {reviews.map((review, idx) => (
                        <section key={idx} className="reviewCard">
                            <div className="summaryDiv">
                                <section className="reviewImgSection">
                                    <img src={review.imageUrl ? review.imageUrl : avatar} />
                                </section>
                                <section className="reviewImgSectionText">
                                    <span><strong>{review.name}</strong></span>
                                    <span>{review.country.toUpperCase()}</span>
                                    {/* Convert rating to stars */}
                                    <span>{((n => [...Array(n).keys()])(review.rating)).map(
                                        (rating, idx) => (<AiFillStar style={starStyle} key={idx} />)
                                    )}</span>
                                </section>
                            </div>

                            <div className="reviewDetails">
                                <main>
                                    {review.review}
                                </main>
                            </div>
                        </section>
                    ))}
                </div>)
            }
        </div>
    )
}


const HomePage /**Component */ = (props) => {
    return (
    <div>
        <NavigationBar active='' />
        <HomePageIntro />
        <CoinsRate />
        <OurServices />
        <HowToEarn />
        <Investments />
        <Reviews />
        <Footer />
    </div>)
}

export {HomePage};