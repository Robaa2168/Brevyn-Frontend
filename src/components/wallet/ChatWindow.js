// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { FaRegClock, FaThumbsUp, FaThumbsDown, FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const ChatWindow = () => {
    // State related to messages
    const initialMessages = [
        { text: "Hello, I'm interested in your offer.", sender: 'buyer', timestamp: new Date() },
        { text: "Great! How can I assist you further?", sender: 'seller', timestamp: new Date() },
        { text: "Can you provide more details on the terms?", sender: 'buyer', timestamp: new Date() },
        { text: "Of course! The terms are as follows...", sender: 'seller', timestamp: new Date() }
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const sendAudio = new Audio('/send.mpeg');



    // Scroll to the bottom of the chat whenever the messages update
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Dummy data for seller profile
    const sellerProfile = {
        name: 'Mc_Gold',
        image: 'https://via.placeholder.com/150', // Placeholder image URL
        lastSeen: 'online',
        positiveFeedback: 787,
        negativeFeedback: 0,
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const timestamp = new Date();
            setMessages([...messages, { text: newMessage, sender: 'buyer', timestamp }]);
            setNewMessage('');
            // Attempt to play send sound
            try {
                sendAudio.play();
            } catch (error) {
                console.error("Failed to play the sound.", error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center border-b border-emerald-200 mb-4 p-2">

                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center mb-2 md:mb-0">
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
            <div ref={messagesContainerRef} className="h-64 overflow-y-auto custom-scrollbar mb-4 px-2">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex w-full ${message.sender === 'buyer' ? 'justify-end' : ''}`}
                    >
                        <div
                            className={`inline-block p-3 my-1 rounded-lg break-words ${message.sender === 'buyer' ? 'bg-green-200' : 'bg-gray-200'} max-w-[75%]`}
                        >
                            {/* Message Text */}
                            <p className="text-xs text-gray-700">{message.text}</p>

                            {/* Timestamp and Double ticks for outgoing messages */}
                            <div className="text-xs text-gray-500 mt-2">
                                {message.timestamp.toLocaleTimeString()}
                                {message.sender === 'buyer' && <span className="ml-2 text-gray-500">✓✓</span>}
                            </div>
                        </div>
                    </div>
                ))}
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
