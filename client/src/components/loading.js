import {GiClockwiseRotation} from "react-icons/gi";
import "./css/loading.css";

/**
 * @desc Animates loading 
 * @param {*} props 
 * @returns Loading Component
 */
const Loading = props => (<div className="loading">
                                <span>
                                        <GiClockwiseRotation />
                                </span>
                          </div>)

export {Loading}