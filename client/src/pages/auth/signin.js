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
 * @route /auth/signin?next=string
 * @param {*} props 
 * @returns 
 */
function SignInForm(props){
    const [params] /*: Object ({}) */= useSearchParams();
    const navigate /*: NavigateObject  */ = useNavigate();

    const [signinForm, setSigninForm]  = useState({
        email : "",
        password: ""
    });
    // Global User state
    const setGlobalUser = useSetRecoilState(UserState);

    function updateForm(e){
        setSigninForm(prevData => ({...prevData, [e.target.name]: e.target.value}))        
    }
    async function signupUser(e){
        e.preventDefault();
        // Verify email and password is present
        if(!signinForm.email.trim() || !signinForm.password.trim()){
            alert("Please, input email and password");
            return
        }
        const signInReq  = await fetch("/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signinForm)
        });
        if(signInReq.ok){
            // Get data 
            const signInRes = await signInReq.json()
            setGlobalUser(prevUser => signInRes);

            // If a next parameter is provided, navigate to next(default /acct/home)
            // const navigateTo = params.next || "/acct/home";
            const navigateTo = params.get("next")|| "/acct/home";
            navigate(navigateTo);
        } else{
            alert("There was an error verifying user. Please try again.")
        }
    }
    return (
    <>
    <div className="auth" style={bgStyle}>
        <form className="form" onSubmit={signupUser}>
            <div>
                <h2>Sign in with email</h2>
                <div className="authImgDiv">
                    {/* <img src={auth} /> */}
                </div>
                <p>
                    Don't have an account?
                    <Link to="/auth/signup" className="authAnchor">
                        Sign up here
                    </Link>
                </p>
                <br />
                <label htmlFor="email">
                    Email: 
                    <input  type="email" required={true} name="email" value={signinForm.email} 
                    minLength={1}
                    onChange={updateForm}
                    />
                </label>

                <label htmlFor="password">
                    Password: 
                    <input type="password" required={true} minLength={5}
                    name="password"
                    value={signinForm.password} onChange={updateForm}
                    />
                </label>
                <label htmlFor="signedin">
                <input type="checkbox" checked={true} />
                Keep me signed in
                </label>

            </div>
            <br />

            <button type="submit" className="authBtn">
                <FaUserAlt /> &nbsp;
                Sign in
            </button>
            <br /><br />
            <p>
                <Link to="/auth/forgotpassword" className="authAnchor" >
                    Forgot password?
                </Link>
                
            </p>
        </form>

        {/* <div className="authImg">
            <img src={SignInImg} alt="sign in" />
        </div> */}
    </div>
        <Footer />
    </>
    )
}


const Signin = props => {
    return (
        <>
            <NavigationBar active='signin'/>
            <SignInForm />
        </>
    );
}

export default Signin;
