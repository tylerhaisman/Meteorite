import React from "react";
import Profile from "../../assets/images/profile.png"
import Image from "next/image";
import type { AppProps } from 'next/app'

const FromMessage = ({ pageProps }: AppProps) => {
    const lines = pageProps.message.split('\n');
    return (
      <div className="message from">
        <Image src={Profile} alt="Other person's profile picture" width={20} height={20}></Image>
        <div className="bubble">
          <div className="response">
            {lines.map((line: string, index: number) => (
              <React.Fragment key={index}>
                <p>{line}</p>
                {index < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
}

export default FromMessage;