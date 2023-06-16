import React from "react";
import Profile from '../../assets/images/profile.png';
import type { AppProps } from 'next/app'
import Image from "next/image";

const ToMessage = ({pageProps}: AppProps) => {
    return ( 
        <div className="message to">
        <div className="bubble">
            <p>{pageProps.message}</p>
        </div>
        <Image src={Profile} alt="Your profile picture" width={20} height={20}></Image>
    </div>
     );
}

export default ToMessage;