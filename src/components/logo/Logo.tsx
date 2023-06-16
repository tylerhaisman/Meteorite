import React from "react";
import Image from "next/image";
import "./style.css";
import Meteorite from "../../assets/images/logo.png";
import Link from "next/link";

const Logo = () => {
    return (
        <div className="logo">
            <Link href="/"><Image src={Meteorite} alt="" width={50} height={50}></Image></Link>
        </div>
    );
}

export default Logo;