// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { FaTimesCircle,FaPaperPlane, FaPaperclip, FaRegClock, FaThumbsUp, FaThumbsDown, } from 'react-icons/fa';

const Chat = () => {
    // Simulating initial chat messages
    const initialMessages = [
        { text: "Hello, I'm interested in your offer.", sender: 'buyer', timestamp: new Date() },
        { text: "Great! How can I assist you further?", sender: 'seller', timestamp: new Date() },
        { text: "Can you provide more details on the terms?", sender: 'buyer', timestamp: new Date() },
        { text: "Of course! The terms are as follows...", sender: 'seller', timestamp: new Date() }
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    // Reference for the message container to scroll into view
    const messagesContainerRef = useRef(null);

    // Audio objects
    const sendAudio = new Audio('/send.mpeg'); // Path to send sound
    const receiveAudio = new Audio('/receive.mpeg'); // Path to receive sound

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
        <div className="flex flex-col md:flex-row justify-center items-start my-5 md:space-x-3">
        {/* Transaction Container */}
        <div className="mx-3 my-5 p-4 bg-white rounded-lg border border-emerald-200 flex-1 md:max-w-2xl mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Order Created</h3>
            <div className="countdown mb-4 p-2 bg-emerald-100 rounded">
                Pay the seller within <strong>00:06:44</strong>
            </div>
            {/* Step indicators */}
            <ol className="list-decimal list-inside mb-4">
                <li>Confirm order info</li>
                <li>Make Payment</li>
                <li>Notify Seller</li>
            </ol>
            {/* Payment details */}
            <div className="payment-details mb-4">
                <div className="flex justify-between text-sm">
                    <span>Amount</span>
                    <strong>£50.000</strong>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Price</span>
                    <strong>£0.810</strong>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Receive Quantity</span>
                    <strong>61.72 USDT</strong>
                </div>
            </div>
            {/* Transfer instructions */}
            <div className="mb-4">
                <div className="mb-2">
                    <label htmlFor="accountNumber" className="text-sm font-semibold">Transfer to account:</label>
                    <input id="accountNumber" type="text" value="LT54 1300 1017 1610 831" disabled className="w-full p-2 mt-1 bg-gray-100 rounded border " />
                </div>
                <button className="w-full p-2 text-emerald-600 border border-emerald-600 rounded hover:bg-emerald-600 hover:text-white transition-colors duration-300">
                    Paid, Notify Seller
                </button>
                {/* Cancel button */}
                <button className="w-full p-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors duration-300 mt-2 flex items-center justify-center">
                    <FaTimesCircle className="mr-2" /> Cancel
                </button>
            </div>
        </div>

            <div className="p-4 bg-white rounded-lg border border-emerald-200 max-w-lg mx-3 my-5 md:mx-auto">
                <div className="flex justify-between items-center border-b border-emerald-200 mb-4 p-2">

                    <div className="flex items-center">
                        <img src={sellerProfile.image} alt={sellerProfile.name} className="w-12 h-12 rounded-full mr-2" />
                        <div>
                            <p className="text-lg font-semibold text-emerald-600">{sellerProfile.name}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                                <FaRegClock className="mr-1" />
                                {sellerProfile.lastSeen}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="flex items-center text-green-800 text-xs font-semibold mr-2 bg-green-50 border border-green-200 rounded-md py-1 px-2">
                            <FaThumbsUp className="mr-1" />
                            {sellerProfile.positiveFeedback}
                        </span>
                        <span className="flex items-center text-red-800 text-xs font-semibold bg-red-100 border border-red-200 rounded-md py-1 px-2">
                            <FaThumbsDown className="mr-1" />
                            {sellerProfile.negativeFeedback}
                        </span>
                    </div>

                </div>
             {/* Message window */}
{/* Message window */}
<div ref={messagesContainerRef} className="h-64 overflow-y-auto mb-4 custom-scrollbar">
    {messages.map((message, index) => (
        <div key={index} className={`message-bubble ${message.sender === 'buyer' ? 'outgoing-message' : 'incoming-message'}`}>
            {/* Message Text */}
            <p className="text-gray-700">{message.text}</p>
            
            {/* Timestamp and Double ticks for outgoing messages */}
            <div className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
                {message.sender === 'buyer' && <span className="ml-2 text-gray-500">✓✓</span>}
            </div>
        </div>
    ))}
</div>




                {/* Message input area */}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <FaPaperclip className="text-gray-500 cursor-pointer" />
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        type="submit"
                        className="bg-emerald-500 text-white p-2 rounded-lg focus:outline-none hover:bg-emerald-600"
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;