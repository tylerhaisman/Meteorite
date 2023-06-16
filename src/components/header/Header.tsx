import React from "react";
import Image from "next/image";
import "./style.css";
import Profile from "../../assets/images/profile.png";
import Logo from "../logo/Logo";

const Header = () => {
    return ( 
        <div className="header">
            <Logo></Logo>
            {/* <button className="signin">
                <Image src={Profile} alt="" width={20} height={20}></Image>
                <p>Sign In</p>
            </button> */}
        </div>
     );
}
 
export default Header;