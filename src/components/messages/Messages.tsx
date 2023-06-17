import React, { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import "./style.css";
import ToMessage from "./ToMessage";
import FromMessage from "./FromMessage";


const Messages = () => {
    return (
        <div className="messages">
            <ToMessage message="Hello world"></ToMessage>
            <FromMessage message="Hello world"></FromMessage>
        </div>
    );
}

export default Messages;