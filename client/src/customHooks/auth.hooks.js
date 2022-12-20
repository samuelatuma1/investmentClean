import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { UserState } from "../globalStore/atoms";
/** 
 * @CustomHook 
 * @returns boolean
*/
const useSignedIn = () /*: boolean */ => {
    // Check Global state value if user is signed in
    const userState /*UserState*/ = useRecoilValue(UserState);
    if(!userState?.token){
        console.log("No token")
        return false;
    }
    
    const token /*: JWTToken */ = userState.token;
    const userIsSignedInReq /*:Request */ = fetch(`/auth/userIsSignedIn/${token}`)
        .then(SignedInReq => SignedInReq.json())
        .then(isSignedInRes => {
            var res = isSignedInRes.isSignedIn
            console.log({res})
            return res
            
        })
        .catch(err => false)
    return userIsSignedInReq;
}

/** 
 * @CustomHook 
 * @returns boolean
*/
const useIsAdmin = () /*: boolean */ => {
    // Check Global state value if user is signed in
    const userState /*UserState*/ = useRecoilValue(UserState);
    if(!userState?.token){
        console.log("No token")
        return false;
    }
    
    const token /*: JWTToken */ = userState.token;
    const userIsAdminReq /*:Request */ = fetch(`/auth/userIsAdmin/${token}`)
        .then(SignedInReq => SignedInReq.json())
        .then(isSignedInRes => {
            var res = isSignedInRes.isAdmin
            console.log({res})
            return res
            
        })
        .catch(err => false)
    return userIsAdminReq;
}
/**

 * @CustomHook
 * @desc Routes a user to sign in page if user tries to access 
 * page without being signed in. Specifies route to reroute user to
 * @useage e.g useReRouteIfNotSignedIn("/acct/home")
 * @param {urlString} next :-> The route to reroute user to if signed in
 */
const useReRouteIfNotSignedIn = (next) => {
    const signedIn = useSignedIn();
    const navigate = useNavigate()
    useEffect(() => {
        async function getSignedIn(){
            if(await signedIn){
                // alert("User signed in")
                console.log("signed in");
            } else{
                navigate(`/auth/signin?next=${next}`);
            }
        }
        getSignedIn()
    }, [])
}
/** 
* @CustomHook
* @desc Routes a user to sign in page if user tries to access 
* page without being an admin. Specifies route to reroute user to
* @useage e.g useReRouteIfNotSignedIn("/acct/home")
* @param {urlString} next :-> The route to reroute user to if signed in
*/
const useReRouteIfNotAdmin = (next) => {
   const signedIn = useIsAdmin();
   const navigate = useNavigate()
   useEffect(() => {
       async function getSignedIn(){
           if(await signedIn){
               // alert("User signed in")
               console.log("admin signed in");
           } else{
            //    alert("Sorry, you do not have access to this page");
               navigate(`/auth/signin?next=${next}`);
           }
       }
       getSignedIn()
   }, [])
}



export {useReRouteIfNotSignedIn, useReRouteIfNotAdmin};