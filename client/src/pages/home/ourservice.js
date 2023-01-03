import { Loading } from "../../components/loading";
import {useState, useEffect} from "react";
import "../css/aboutus.css";
import ourservicedefaultimg from "../../static/service.png";
import NavigationBar from "../../components/navigation";
import { Footer } from "../../components/footer";
import { useParams } from "react-router-dom";

const OurServiceDTO = {
    _id: String,
    title: String,
    body: String,
    imgUrl: String
  }
const OurServiceComponent = ({_id} /**{_id: ObjectId} */) /** JSX.Element */ => {
    const [loading, setLoading] = useState/**<boolean> */(false);

    const [ourService, setOurService] = useState/**<AboutUsDTO>*/({
        _id,
        title: "Service Name Title",
        body: "Service you want to talk about You can write as long as you want",
        imgUrl: ourservicedefaultimg
    })
    useEffect(() => {
        fetchOurService();
    }, [])
    async function fetchOurService() /** void*/{
        setLoading(true);

        const ourServiceReq /** Response */ = await fetch(`/home/ourservices/${_id}`);
        setLoading(false);
        if(ourServiceReq.ok){
            const ourServiceResponse /** AboutusDTO */= (await ourServiceReq.json()).ourService;
            if(ourServiceResponse !== null){
                setOurService(ourServiceResponse);
            }

        }
    }
    return (
        <div className="abousUsDiv">
            {
                loading ? <Loading /> :
                <section className="aboutUsSection">
                    <h1>{ourService.title}</h1>
                    <img src={ourService.imgUrl || ourservicedefaultimg} />
                    <div  dangerouslySetInnerHTML={{__html: ourService.body}} />
                </section>
            }
        </div>
    )
}

const OurService = () /** JSX.Element */ => {

    const {_id} = useParams();
    return (
        <div >
            <NavigationBar active='' />
            <OurServiceComponent _id={_id} />
            <Footer />
        </div>
    )
}

export {OurService};