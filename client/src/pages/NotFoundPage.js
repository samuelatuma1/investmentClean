import { Link } from "react-router-dom";
import "./css/notfound.css";
import {BiErrorCircle} from "react-icons/bi";
const NotFoundPage /** Component */ = () /** JSX */ => {
    return (<div className="notFound">
        <h1>4<BiErrorCircle />4</h1>
        <p>This page was not found. </p>
        <p>You may have mistyped the address, or the page may have been moved.</p>
        <Link to="/">Take me to the homepage</Link>
    </div>)
}

export {NotFoundPage}