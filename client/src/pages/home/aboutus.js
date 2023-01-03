import { Loading } from "../../components/loading";
import {useState, useEffect} from "react";
import "../css/aboutus.css";
import ourservicedefaultimg from "../../static/service.png";
import NavigationBar from "../../components/navigation";
import { Footer } from "../../components/footer";


const AboutusDTO = {
    _id: String,
    title: String,
    body: String,
    imgUrl: String
  }
const AboutUsComponent = () /** JSX.Element */ => {
    const [loading, setLoading] = useState/**<boolean> */(false);
    const [aboutus, setAboutus] = useState/**<AboutUsDTO>*/({
        _id: null,
        title: "About Us Title",
        body: "About what your organization do. You can write as long as you want",
        imgUrl: ourservicedefaultimg
    })
    useEffect(() => {
        fetchAboutUs();
    }, [])
    async function fetchAboutUs() /** void*/{
        setLoading(true);
        const aboutUsReq /** Response */ = await fetch("/home/aboutusfull");
        setLoading(false);
        if(aboutUsReq.ok){
            const aboutUsResponse /** AboutusDTO */= (await aboutUsReq.json()).aboutUs;
            if(aboutUsResponse !== null){
                setAboutus(aboutUsResponse);
            }

        }
    }
    return (
        <div className="abousUsDiv">
            {
                loading ? <Loading /> :
                <section className="aboutUsSection">
                    <h1>{aboutus.title}</h1>
                    <img src={aboutus.imgUrl || ourservicedefaultimg} />
                    <div  dangerouslySetInnerHTML={{__html: aboutus.body}} />
                        
                 
                </section>
            }
        </div>
    )
}

const AboutUs = () /** JSX.Element */ => {
    return (
        <div >
            <NavigationBar active='aboutus' />
            <AboutUsComponent />
            <Footer />
        </div>
    )
}

export {AboutUs};