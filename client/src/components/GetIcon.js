// Icons
import {FaArrowUp} from "react-icons/fa";
import { GrLineChart} from "react-icons/gr"
import {BiDotsHorizontalRounded, BiLineChart} from "react-icons/bi";
import {BsFillCalendar2CheckFill, BsShield, BsBrightnessHigh, BsBoxArrowDown, BsBriefcase} from "react-icons/bs";
import {RiFocus2Fill} from "react-icons/ri"
import {AiFillStar, AiOutlineArrowRight} from "react-icons/ai";


function GetIcon(idx /** Number */) /** JSX.Component */{
    const fontSize /** string */ = '32px'
    const iconsDict = {
        0: {
            icon: <BsShield style={{fontSize, color: 'teal'}}/>
        },
        1: {
            icon: <BsBrightnessHigh style={{fontSize, color: 'gold'}}/>
        },
        2: {
            icon: <RiFocus2Fill style={{fontSize, color: 'green'}} />
        },
        3: {
            icon: <BsBoxArrowDown style={{fontSize, color: '#d90769'}} />
        },
        4: {
            icon: <BiLineChart style={{fontSize, color: 'navy'}} />
        },
        5: {
            icon: <BsBriefcase style={{fontSize, color: 'orange'}} />
        }

    }

    return iconsDict.hasOwnProperty(idx) ? iconsDict[idx].icon : iconsDict[1].icon
}

export {GetIcon}