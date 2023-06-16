import React from "react";
import Image from "next/image";
import "./style.css";
import Profile from "../../assets/images/profile.png"

const Header = () => {
    return ( 
        <div className="header">
            <div className="logo">
                <h1>meteorite</h1>
            </div>
            <button className="signin">
                <Image src={Profile} alt="" width={20} height={20}></Image>
                Sign In
            </button>
        </div>
     );
}
 
export default Header;