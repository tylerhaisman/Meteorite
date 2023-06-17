"use client"

import "./style.css";
import React, {useEffect} from "react";
import Header from "../components/header/Header"
import Image from "next/image";
import Planet from "../assets/images/planet.png"
import Arrow from "../assets/images/arrow.png"
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    myFirstCall();
  }, [])
  const myFirstCall = async () => {
    const response = await fetch("/api");
    
  }

  return (
    <div className="home">
      <div className="circle"></div>
      <div className="content">
        <Header></Header>
        <div className="cover">
          <div className="title">
            <p className="name">Meteorite Messaging</p>
            <h1>Messaging from another planet.</h1>
            <Link href="/chat"><button>Get Started with Meteorite <Image src={Arrow} alt="arrow pointing right" width={20} height={20}></Image></button></Link>
          </div>
          <div className="image">
            <Image src={Planet} alt="Image of another planet" width={700} height={700}></Image>
          </div>
        </div>
      </div>
    </div>
  )
}
