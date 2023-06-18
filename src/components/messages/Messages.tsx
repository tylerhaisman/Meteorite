// import React, { useEffect, useState, FormEvent } from "react";
// import Image from "next/image";
// import "./style.css";
// import ToMessage from "./ToMessage";
// import FromMessage from "./FromMessage";
// import { useSession } from "next-auth/react"
// import { Toast, toast } from "react-hot-toast";

// type Props = {
//     withUsername: string
//   }

// const Messages = (props: Props) => {

//     const { data: session } = useSession();
//     const [sortedMessages, setSortedMessages] = useState([]);
//     const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

//     const pollForNewMessages = async () => {
//         const messages = await getMessages();
//         setSortedMessages(messages.message.reverse());
//       };
    
//       const startPolling = () => {
//         if (pollingIntervalId) {
//           clearInterval(pollingIntervalId);
//         }
//         const intervalId = setInterval(pollForNewMessages, 1000);
//         setPollingIntervalId(intervalId);
//       };
    
//       const stopPolling = () => {
//         if(pollingIntervalId){
//             clearInterval(pollingIntervalId);
//         }
//         setPollingIntervalId(null);
//       };

//     useEffect(() => {
//         startPolling();
//         return () => stopPolling();
//       }, [props.withUsername]);

//       const printMessages = sortedMessages.map((item, pos) => {

//       });

//     const getMessages = async () => {
//         try {
//             const response = await fetch('/api/database', {
//                 method: 'POST',
//                 headers: {
//                     'Content-type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     action: "getMessages",
//                     email: session?.user?.email,
//                     withUsername: props.withUsername,
//                 }),
//             });
//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error(error);
//             toast.error("An error occured.");
//             throw error;
//         }
//     };

//     return (
//         <div className="messages">
//             <ToMessage message="Hello world"></ToMessage>
//             <FromMessage message="Hello world"></FromMessage>
//         </div>
//     );
// }

// export default Messages;