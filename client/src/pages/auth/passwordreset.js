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

// Router 
import { useNavigate, useParams, useSearchParams} from 'react-router-dom';

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
    // 
    let { token } = useParams();
    const [params] /*: Object ({}) */= useSearchParams();
    const navigate /*: NavigateObject  */ = useNavigate();

    const [forgotPasswordForm, setForgotPasswordForm]  = useState({
        newPassword : "",
        confirmPassword: ""
    });
    const [mailResponse /** String */, setMailResponse /** Funct<T, T> */]  = useState("");
    // Global User state
    const setGlobalUser = useSetRecoilState(UserState);

    function updateForm(e){
        setForgotPasswordForm(prevData => ({...prevData, [e.target.name]: e.target.value}))        
    }
    async function signupUser(e){
        e.preventDefault();
        let mailResp = ""
        // Verify newPassword and password is present
        if(!forgotPasswordForm.newPassword.trim()){
            alert("Please, input newPassword");
            return
        }
        if(forgotPasswordForm.confirmPassword !== forgotPasswordForm.newPassword){
            alert("Passwords must match");
            return
        }
        const forgotPasswordReq /** Response */ = await fetch(`/auth/updatepassword/${token}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(forgotPasswordForm)
        });
        if(forgotPasswordReq.ok){
            // Get data 
            const forgotPasswordResponse /** {sent : boolean } */ = await forgotPasswordReq.json()
            if(forgotPasswordResponse.error){
                mailResp = "Token expired, please, go back to forgot password and try again."
            }
            else{
                mailResp /** String */ = "Password reset successful for " + forgotPasswordResponse.email;
                alert(mailResp);
                return  navigate("/auth/signin");
            
            }
        } else{
            mailResp /** String */ = "Something went wrong, please, try again"
        }
        setMailResponse(mailResp);
    }
    return (
    <>
    <div className="auth" style={bgStyle}>
        <form className="form" onSubmit={signupUser}>
            <div>
                <h2>Reset Password </h2>
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
                <label htmlFor="newPassword">
                    New Password: 
                    <input  type="password" required={true} name="newPassword" value={forgotPasswordForm.newPassword} 
                    minLength={5}
                    onChange={updateForm}
                    />
                </label>

                <label htmlFor="confirmPassword">
                    Confirm Password: 
                    <input  type="password" required={true} name="confirmPassword" value={forgotPasswordForm.confirmPassword} 
                    minLength={5}
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


const PasswordReset = props => {
    return (
        <>
            <NavigationBar active='signin'/>
            <ForgotPasswordForm />
        </>
    );
}

export default PasswordReset;
