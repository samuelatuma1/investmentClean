import { useEffect, useState } from "react";
import { Loading } from "./loading";
import { Link } from "react-router-dom";
// css
import "./css/footer.css";


// icons
import {FaRegCopyright} from "react-icons/fa";
import {AiOutlineCopyright} from "react-icons/ai";
const FooterDTO /** {[Key: String]: String} */= {
    companyName: String,
    about: String,
    address: String, 
    email: String,
    phone: String
}
const Footer /** Component */ = (props /** {[Key: String]: any} */) => /** JSX */{
    const [loading /** boolean */, setLoading /** Funct<T, T> */] = useState(false);
    const [footer /** FooterDTO */, setFooter /** Footer */] = useState({
        companyName: "Company Name",
        about: "About",
        address: "Company's  address", 
        email: "company@mail.com",
        phone: "company's phone"
    });
    // Effects
    useEffect(() => {
        getFooter()
    }, [])
    async function getFooter() /**void */{
        const url /** String */  = "/home/footer";
        setLoading(true);
        const footerReq /**Response*/ = await fetch(url);
        setLoading(false);
        if(footerReq.ok){
            const footerRes /** { footer: FooterDTO} */= await footerReq.json()
            if(footerRes.footer){
                setFooter(footerRes.footer);
            }
        }
    }

    const flexDisplay /** {[Key: String]: string}*/ = {
        display: "flex",
        alignItems: "center"
    }
    return (<>
        {
            loading ? <Loading />:
            <div className="footerDiv">
                <div className="footerGridDiv">
                    <section>
                        <h4>About</h4>
                        <br />
                        <p>{footer?.about}</p>
                        <br />
                        
                    </section>

                    <section className="address">
                        <h4>Address</h4>
                        <br/>
                        <p style={{width: '50%'}}>{footer?.address}</p>
                    </section>

                    <section className="contact">
                        <h4>Contact</h4>
                        <br />
                        <p >
                            <a href={`mailto:${footer?.email}?subject=Hello ${footer.companyName}`} target="_blank">Send email</a>
                        </p>
                        <p >
                            <a href={`tel:${footer?.phone}`}>Call {footer?.phone}</a>
                        </p>
                    </section>

                    <section className="address">
                    <h2>{footer.companyName}</h2>
                    <Link to="/admin" className="adminLink">
                        <p style={flexDisplay}> 
                            Copyright &nbsp; 
                            
                                <AiOutlineCopyright /> 
                            
                            {new Date().getFullYear()} | {footer.companyName}
                        </p>
                    </Link>
                        <p>All rights reserved.</p>
                        

                    </section>
                </div>
            </div>
        }
    </>)
}

export {Footer}