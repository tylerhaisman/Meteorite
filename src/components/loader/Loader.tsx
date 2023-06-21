import React from "react";
import "./style.css";
import Circle from "../cirlce/Circle";

const Loader = () => {
    return (
        <div className="loader">
            {/* <Circle></Circle> */}
            <div className="lds-ripple"><div></div><div></div></div>
        </div>
    );
}

export default Loader;