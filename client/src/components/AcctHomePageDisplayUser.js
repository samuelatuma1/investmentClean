
import  { UserState /** UserStateModel */ } from "../globalStore/atoms";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useState, useRef } from "react";
import { Utilities } from "../general/utilities";

import "./css/AcctHomePageDisplay.css";
import { FaUserAlt } from "react-icons/fa";
import { BsChevronCompactDown } from "react-icons/bs";
const UserStateModel = {
    fullName: String,
    email: String,
    token: String,
    _id: String,
}
const passwordFormObject = {
    oldPassword : String,
    newPassword : String
}
const DisplayWelcome /** Component */ = ({user /** UserStateModel */, pageName /**String */}) /** JSX */ => {
    const userState/** UserStateModel */ = useRecoilValue(UserState);
    const displayWelcomeFormRef /** Ref */ = useRef(null);
    user = user ? user: userState;

    const [changePasswordForm /** passwordFormObject */, setChangePasswordForm /** Funct<T,T> */] = useState({
        oldPassword: "",
        newPassword: "",
        retypePassword: ""
    })
    const [message /** String */, setMessage /** Funct<T, T> */] = useState("");
    const changeFormAction  = (e /** EventObject */) /** void */ => {
        setChangePasswordForm(data => ({...data, [e.target.name]: e.target.value}));
    }
    const submitFormAction = async (e /** EventObject */) /** void */ => {
        e.preventDefault();
        // check if passwords match
        if (changePasswordForm.newPassword !== changePasswordForm.retypePassword){
            alert("Please, match passwords")
            return
        }
        // submit form
        const url /** String */ = "/auth/changepassword";

        const changePassword /** Response*/ = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: "bearer "+ user?.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(changePasswordForm)
        })
        setChangePasswordForm({
            oldPassword: "",
            newPassword: "",
            retypePassword: ""
        })

        if(changePassword.ok){
            setMessage("Password successfully changed")
        }
        else{
            setMessage("Password update failed, current password not correct")
        }
    }

    const toggleFormDisplayAction = (e /** EventObject */) /** void */ => {
        displayWelcomeFormRef?.current?.classList.toggle("hide");
    }
    return (
        
        
        <section className='displayWelcome'>
            <h2>{pageName}</h2>
            <p>{Utilities.greet()} {Utilities.getFirstName(user?.fullName)}</p>
            <button className="" onClick={toggleFormDisplayAction}>
                <Link to="">
                    Change Password <BsChevronCompactDown  />
                </Link>
            </button>
            <form onSubmit={submitFormAction} ref={displayWelcomeFormRef} className="hide">
                <p>{message}</p>
                <label htmlFor="">
                    Current password
                    <input 
                     name="oldPassword"
                     type={"password"}
                     minLength={5}
                     value={changePasswordForm.oldPassword}
                     onChange={changeFormAction}
                    />
                </label>

                <label htmlFor="">
                    New password
                    <input 
                    minLength={5}
                    type="password"
                    name="newPassword"
                    value={changePasswordForm.newPassword}
                    onChange={changeFormAction}
                    />
                </label>

                <label htmlFor="">
                    Retype Password
                    <input 
                    minLength={5}
                    type={"password"}
                    name="retypePassword"
                    value={changePasswordForm.retypePassword}
                    onChange={changeFormAction}
                    />
                </label>
                <button className="authBtn">
                    Submit Password change
                </button>
            </form>
        </section>
        
    )
    
}

export {DisplayWelcome};