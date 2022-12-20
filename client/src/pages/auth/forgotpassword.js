// Styles
import "../css/auth.css";
import SignInImg from "./static/signin.png"
// Routing
import {Link} from "react-router-dom";
// React Hooks
import {useState, useEffect} from "react";

// Components
import  NavigationBar from "../../components/navigation.js";
import { Footer } from "../../components/footer";

// Static files
import imgBg from "../../static/home/img.svg";
import auth from "../../static/auth.png";
import {FaUserAlt} from "react-icons/fa";


// Get Global User
import {UserState} from "../../globalStore/atoms.js";
// Import global management tool
import {
    useSetRecoilState
} from "recoil";



// router
import {useNavigate, useParams, useSearchParams} from "react-router-dom";


const bgStyle /**Object<String, String> */= {
    backgroundImage: `url(${imgBg})`, // SVG Background
    backgroundSize: "contain",
    minHeight: "250px",
    backgroundcolor: "white"
    
}
/**
 * @route /auth/forgotpassword
 * @param {*} props 
 * @returns 
 */
function ForgotPasswordForm(props){
    const [params] /*: Object ({}) */= useSearchParams();
    const navigate /*: NavigateObject  */ = useNavigate();

    const [forgotPasswordForm, setForgotPasswordForm]  = useState({
        email : ""
    });
    const [mailResponse /** String */, setMailResponse /** Funct<T, T> */]  = useState("");
    // Global User state
    const setGlobalUser = useSetRecoilState(UserState);

    function updateForm(e){
        setForgotPasswordForm(prevData => ({...prevData, [e.target.name]: e.target.value}))        
    }
    async function signupUser(e){
        e.preventDefault();
        // Verify email and password is present
        if(!forgotPasswordForm.email.trim()){
            alert("Please, input email");
            return
        }
        const forgotPasswordReq  = await fetch("/auth/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(forgotPasswordForm)
        });
        if(forgotPasswordReq.ok){
            // Get data 
            const forgotPasswordResponse /** {sent : boolean } */ = await forgotPasswordReq.json()

            const mailResp /** String */ = "An email has been sent to reset password"
            setMailResponse(mailResp);
            setForgotPasswordForm(prevData => ({...prevData, email: ""}));
        } else{
        }
    }
    return (
    <>
    <div className="auth" style={bgStyle}>
        <form className="form" onSubmit={signupUser}>
            <div>
                <h2>Forgot Password</h2>
                <div className="authImgDiv">
                    {/* <img src={auth} /> */}
                </div>
                <p>
                    Remember your password?
                    <Link to="/auth/signin" className="authAnchor">
                        Sign in
                    </Link>
                </p>
                <br />
                <label htmlFor="email">
                    EMAIL ADDRESS: 
                    <input  type="email" required={true} name="email" value={forgotPasswordForm.email} 
                    minLength={1}
                    onChange={updateForm}
                    />
                </label>

                

            </div>
            <p>{mailResponse}</p>
            <br />
            <button type="submit" className="authBtn">
                <FaUserAlt /> &nbsp;
                Continue
            </button>
            
        </form>
    </div>
        <Footer />
    </>
    )
}


const ForgotPassword = props => {
    return (
        <>
            <NavigationBar active='signin'/>
            <ForgotPasswordForm />
        </>
    );
}

export default ForgotPassword;
