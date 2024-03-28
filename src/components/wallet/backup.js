// ChatWindow.js
// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from "lottie-react";
import loadingAnimation from '../lottie/loading.json';
import unavailableAnimation from '../lottie/noChats.json';
import { FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import { useSocket } from '../../SocketContext'; 
import { useUser } from "../context";
import { FaRegClock, FaExclamationCircle, FaThumbsUp, FaThumbsDown, FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const ChatWindow = (tradeId) => {
    const socket = useSocket();
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const sendAudio = new Audio('/send.mpeg');
    const { user } = useUser();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Away? Reach out on WhatsApp +254762735994.",
            sender: 'seller',
            timestamp: new Date(),
            isSending: false,
            sendFailed: false,
        }
    ]);



    const sellerProfile = {
        _id: '658db0c10bfefbb749a5c308',
        name: 'Lucy Kiarie',
        image: 'https://www.immunizationadvocates.org/app/uploads/2020/06/Lucy-Kiarie_350x350_acf_cropped.jpg',
        lastSeen: 'online',
        positiveFeedback: 3115,
        negativeFeedback: 23,
    };

    // Fetch messages when the component mounts or tradeId changes
    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/chat/get-messages?tradeId=${tradeId.tradeId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                // Transform the fetched messages
                const fetchedMessages = response.data.map((message, index) => ({
                    id: message._id,  // Ensuring each message has a unique id
                    text: message.message,
                    sender: message.sender === user._id ? 'buyer' : 'seller',
                    timestamp: new Date(message.createdAt), // Ensuring timestamp is a Date object
                    isSending: false,
                    sendFailed: false,
                }));

                // Append the fetched messages to the existing ones
                setMessages(existingMessages => [...existingMessages, ...fetchedMessages]);
                setIsError(false);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (tradeId.tradeId) {
            fetchMessages();
        }
    }, [tradeId.tradeId, user?.token]);


    // Ensure the chat window scrolls to the latest message
    useEffect(() => {
        if (messagesContainerRef.current) {
            const { current } = messagesContainerRef;
            current.scrollTop = current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const tempId = `temp-${Date.now()}`;  // Assigning a temporary ID to the new message

        const tempMessage = {
            id: tempId,
            text: newMessage,
            sender: 'buyer',  // Assuming 'buyer' is the current user
            timestamp: new Date(),
            isSending: true,
        };
        setMessages(messages => [...messages, tempMessage]); // Updating the messages state
        setNewMessage('');

        try {
            const response = await api.post('/api/chat/send-message', {
                tradeId: tradeId.tradeId,
                message: newMessage,
                receiver: sellerProfile._id, // Replace with actual receiver ID
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // Updating messages with server-assigned ID
            setMessages(currentMessages =>
                currentMessages.map(msg => {
                    if (msg.id === tempId) {
                        // Play the send audio sound
                        sendAudio.play();
                        return { ...msg, id: response.data._id, isSending: false }; // Update with actual message ID from response
                    }
                    return msg;
                })
            );
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");

            // Marking the temporary message as failed to send
            setMessages(currentMessages =>
                currentMessages.map(msg => {
                    if (msg.id === tempId) {
                        return { ...msg, isSending: false, sendFailed: true };
                    }
                    return msg;
                })
            );
        }
    };


    const retrySendMessage = async (messageId) => {
        const messageToRetry = messages.find(m => m.id === messageId);
        if (!messageToRetry) return;

        // Update message as retrying
        setMessages(currentMessages => currentMessages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, isSending: true, sendFailed: false };
            }
            return msg;
        }));

        try {
            // Replace with actual API call
            const response = await api.post('/api/chat/send-message', {
                tradeId: tradeId.tradeId, // Ensure tradeId is available in scope or passed as prop
                message: messageToRetry.text,
                receiver: sellerProfile._id, // Replace with actual receiver ID
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // Update message with response, making sure to keep the same ID
            setMessages(currentMessages => currentMessages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, id: response.data._id, isSending: false, sendFailed: false, timestamp: new Date(response.data.createdAt) };
                }
                return msg;
            }));
        } catch (error) {
            console.error("Error resending message:", error);

            // Mark the message as failed again
            setMessages(currentMessages => currentMessages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, isSending: false, sendFailed: true };
                }
                return msg;
            }));

            toast.error("Failed to resend message.");
        }
    };


    const transformMessage = (message) => {
        return {
            id: message._id,
            text: message.message,
            sender: message.sender === user._id ? 'buyer' : 'seller',
            timestamp: new Date(message.createdAt),
            isSending: false,
            sendFailed: false,
        };
    };

    useEffect(() => {
        if (socket) { 
            console.log('Setting up socket listeners');
    
            socket.on('newMessage', (data) => {
                console.log('New message received:', data);
                const incomingMessage = transformMessage(data);
                  // Check if the incoming message's sender ID matches the current user's ID
                  if(data.sender!== user._id) {
                    setMessages((currentMessages) => [...currentMessages, incomingMessage]);
                }
            });
    
            return () => {
                console.log('Removing socket listeners');
                socket.off('newMessage');
            };
        } else {
            console.log('Socket not initialized');
        }
    }, [socket, user._id]);



    // Scroll to the bottom of the chat whenever the messages update
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className="bg-gray-100 flex justify-between items-center border-b border-emerald-200 mb-4 p-2">

                <div className="flex flex-wrap items-center justify-between w-full">
                    <div className="flex items-center mb-2 md:mb-0 shrink-0">
                        <img src={sellerProfile?.image} alt={sellerProfile?.name} className="w-12 h-12 rounded-full mr-2" />
                        <div>
                            <p className="text-lg font-semibold text-emerald-600">{sellerProfile?.name}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                                <FaRegClock className="mr-1" />
                                {sellerProfile?.lastSeen}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="flex items-center text-green-800 text-xs font-semibold mr-2 bg-green-50 border border-green-200 rounded-md py-1 px-2">
                            <FaThumbsUp className="mr-1" />
                            {sellerProfile?.positiveFeedback}
                        </span>
                        <span className="flex items-center text-red-800 text-xs font-semibold bg-red-100 border border-red-200 rounded-md py-1 px-2">
                            <FaThumbsDown className="mr-1" />
                            {sellerProfile?.negativeFeedback}
                        </span>
                    </div>
                </div>



            </div>
            {/* Message window */}
            <div>
                {isLoading ? (
                    // Show loading animation
                    <div className="flex justify-center items-center h-64">
                        <Lottie animationData={loadingAnimation} style={{ width: 150, height: 150 }} />
                    </div>
                ) : isError ? (
                    // Show not found/error animation
                    <div className="flex justify-center items-center h-64">
                        <Lottie animationData={unavailableAnimation} style={{ width: 150, height: 150 }} />
                    </div>
                ) : (
                    <div ref={messagesContainerRef} className="h-64 overflow-y-auto custom-scrollbar mb-4 px-2">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex w-full ${message.sender === 'buyer' ? 'justify-end' : ''}`}>
                                <div className={`inline-block p-3 my-1 rounded-lg break-words ${message.sender === 'buyer' ? 'bg-green-200' : 'bg-gray-200'} max-w-[75%]`}>
                                    {/* Message Text */}
                                    <p className="text-xs text-gray-700">{message.text}</p>

                                    {/* Timestamp and Message Status */}
                                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                                        {message.timestamp.toLocaleTimeString()}

                                        {/* Spinner while sending */}
                                        {message.isSending && <FaSpinner className="animate-spin ml-2 text-gray-500" size={14} />}

                                        {/* Double tick for sent message */}
                                        {!message.isSending && !message.sendFailed && <span className="ml-2 text-gray-500">✓✓</span>}

                                        {/* Red exclamation for failed message */}
                                        {message.sendFailed &&
                                            <FaExclamationCircle
                                                className="ml-2 text-red-500 cursor-pointer"
                                                size={14}
                                                onClick={() => retrySendMessage(message.id)}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>





            {/* Message input area */}
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center sm:w-3/4 md:w-full">
                <FaPaperclip className="text-gray-500 cursor-pointer" />
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-xs p-2 border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500 " // Adjust the width based on screen size
                />
                <button
                    type="submit"
                    className="text-xs bg-emerald-500 text-white p-2 rounded-lg focus:outline-none hover:bg-emerald-600"
                >
                    <FaPaperPlane />
                </button>
            </form>

        </>
    );
};

export default ChatWindow;
