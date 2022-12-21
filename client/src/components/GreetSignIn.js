
import  { UserState /** UserStateModel */ } from "../globalStore/atoms";

import { useRecoilValue } from "recoil";

import { Utilities } from "../general/utilities";

import "./css/greetSignin.css";
import { FaUserAlt } from "react-icons/fa";
const UserStateModel = {
    fullName: String,
    email: String,
    token: String,
    _id: String,
}

const WelcomeSignIn /** Component */ = ({user /** UserStateModel */}) /** JSX */ => {
    const userState = useRecoilValue(UserState);
    user = user ? user: userState;
    /**
     * 
     * @param {string} data 
     * @returns {string} first name
     */
    function getFirstName(data /** string */) /** string */{
        const names /**string */ = data?.split(" ");
        if(names){
            if(names.length >= 1){
                return names[0];
            }
        }
        return "user";
    }
    return (
        
        
        <section className='authentication'>
            <li className='greet'>
                {/* <Link to="/auth/signin" className="navAnchor signin">  */}
                    <FaUserAlt /> {getFirstName(user?.fullName)}
                    {/* {Utilities.greet()} {user?.fullName} */}
                {/* </Link>  */}
            </li>
            {/* <li className='signup'>Sign Up</li> */}
        </section>
        
    )
    
}

export {WelcomeSignIn};