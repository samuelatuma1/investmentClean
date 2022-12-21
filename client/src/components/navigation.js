import {
    Link
} from "react-router-dom";

import {useEffect, useRef} from "react";
// Style sheet
import './css/navigation.css';

// Icons
import {FaHamburger} from "react-icons/fa";
import {AiFillHome} from "react-icons/ai";
import { WelcomeSignIn } from "./GreetSignIn";

/**
 * @desc gives HTMLElement in navBar with className matching whatever value passed as active in props a class of active
 * @example <NavigationBar active='signin' /> :-> Gives HTMLElement with className signin a class of active
 * @param {*} props 
 * @returns 
 */
export default function NavigationBar(props){
    const navBar = useRef()
    const toggleNavRef = useRef()
    useEffect(() => {
        
        /**
         * @desc Removes hide class from toggleDisplay on big screen size
         */
        function removeIfQueryMatches(screenSize){
            if (screenSize.matches){
                const display = toggleNavRef;
                display.current.classList.remove("hide");
            }
        }
        let screenSize = window.matchMedia("(min-width: 600px)")
        
        // Continually listen for screen size change
        removeIfQueryMatches(screenSize)
        screenSize.addEventListener("change", removeIfQueryMatches);

        // Style the active link
        styleActive()
        return function(){
            screenSize.removeEventListener("change", removeIfQueryMatches)
            
        }
    })


    /**
     * @type event Handler
     * @desc toggles display of navbar menu for mobile devices
     */
    function toggleDisplay(event){
        const display = toggleNavRef;
        
        display.current.classList.toggle("hide");
    }

    /**
     * @desc Searches for the first element whose classList includes @param find, adds active class to element
     * @params {element} The  html element we wish to explore,
     * @params {find} the className we want to add active to
     */
    function exploreElem(element, find){
        if (element.classList.contains(find)){
            element.classList.add('active')
            return
        }
            
        for(let child of element.children){
            exploreElem(child, find)
        }
    }
    /**
     * @desc Get what part in the navigation we are in
     */
    function styleActive(){
        let nav = navBar.current

        // Get the active data
        let active = props.active || 'home'
        exploreElem(nav, active)

    }


    return (
        <nav ref={navBar}>
            <section className="home">
            <li>
                
                <Link to="/" className="navAnchor">
                    <AiFillHome />
                </Link>
            </li>
            <i onClick={toggleDisplay}>
                <FaHamburger />
            </i> 
            </section>
            
            <ul className="toggleDisplay hide" ref={toggleNavRef}>
            <section className='mainNav'>
                <li>
                    <Link to="/" className="navAnchor home">
                        Home
                    </Link>
                </li>
                <li >
                    <Link to="/acct/home" className="navAnchor UserAccountHomePage">
                        Account 
                    </Link>
                </li>

                <li className='signin'>
                    <Link to="/auth/signin" className="navAnchor signin"> 
                        Sign In
                     </Link> 
                </li>
            </section>

            
            {/* Import Sign in Here */}
            <WelcomeSignIn />

            </ul>                    
        </nav>
    )
}