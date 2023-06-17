import React from "react";
import Profile from '../../assets/images/profile.png';
import Image from "next/image";

type props = {
    message: string
}

const ToMessage = ({ message }: props) => {
    return ( 
        <div className="message to">
        <div className="bubble">
            <p>{message}</p>
        </div>
        <Image src={Profile} alt="Your profile picture" width={20} height={20}></Image>
    </div>
     );
}

export default ToMessage;