// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { FaTimesCircle, } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import { useUser } from "../context";
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

const Chat = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const { tradeId } = useParams();
    const [tradeDetails, setTradeDetails] = useState(null);
    const [showPaidConfirmModal, setShowPaidConfirmModal] = useState(false);
    const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isPaying, setIsPaying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);


    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Calculate time left based on current time and expiration time
        const calculateTimeLeft = () => {
            if (tradeDetails && tradeDetails.expiresAt) {
                const expirationTime = new Date(tradeDetails.expiresAt).getTime();
                const now = Date.now();
                const difference = expirationTime - now;

                if (difference > 0) {
                    // Update time left
                    setTimeLeft(Math.round(difference / 1000)); // in seconds
                } else if (difference <= 0 && timeLeft !== 0) {
                    // Time is up, trade has expired, and not yet updated
                    setTimeLeft(0);
                }
            }
        };

        calculateTimeLeft(); // Initial calculation
        const intervalId = setInterval(calculateTimeLeft, 1000); // Update every second

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, [tradeDetails]);

    useEffect(() => {
        // Fetch trade details from API
        const fetchTradeDetails = async () => {
            try {
                const response = await api.get(`/api/trade/${tradeId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                });
                if (response.status === 200) {
                    setTradeDetails(response.data);
                } else {
                    toast.error('Failed to fetch trade details.');
                }
            } catch (error) {
                toast.error('Error fetching trade details: ' + (error.response?.data?.message || error.message));
            }
        };

        if (tradeId) {
            fetchTradeDetails();
        }
    }, [tradeId]);

    useEffect(() => {
        // This function is responsible for re-fetching the trade details
        const reFetchTradeDetails = async () => {
            setIsRestarting(true); // Indicate that fetching is in progress
            try {
                // Make the API call to fetch the trade details
                const response = await api.get(`/api/trade/${tradeId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                });

                if (response.status === 200) {
                    setTradeDetails(response.data);
                    toast.info('Trade details have been updated.');
                } else {
                    toast.error('Failed to re-fetch trade details.');
                }
            } catch (error) {
                toast.error('Error re-fetching trade details: ' + (error.response?.data?.message || error.message));
            } finally {
                setIsRestarting(false); // Indicate that fetching is complete
            }
        };

        if (timeLeft === 0 && tradeDetails && tradeDetails.status !== 'cancelled') {
            reFetchTradeDetails();
        }
    }, [timeLeft]);





    const handlePaidClick = () => {
        setShowPaidConfirmModal(true); // Show the paid confirmation modal
    };


    const handleCancelClick = () => {
        setShowCancelConfirmModal(true); // Show the cancel confirmation modal
    };

    const handlePaidConfirm = async () => {
        setIsPaying(true);
        try {
            const response = await api.patch(`/api/trade/${tradeId}/confirm-payment`, {
                tradeId,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });
            if (response.status === 200) {
                toast.success('Payment confirmed successfully!');
                // Update local state with trade details
                setTradeDetails(response.data); // Assuming response.data contains trade details
            } else {
                throw new Error('Failed to confirm payment.');
            }
        } catch (error) {
            toast.error('Error confirming payment: ' + (error.response?.data?.message || error.message));
        } finally {
            setShowPaidConfirmModal(false);
            setIsPaying(false);
        }
    };

    const handleCancelConfirm = async () => {
        setIsCancelling(true);
        try {
            const response = await api.patch(`/api/trade/${tradeId}/cancel`, {
                tradeId,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });
            if (response.status === 200) {
                toast.success('Trade cancelled successfully!');
                // Update local state with trade details
                setTradeDetails(response.data); // Assuming response.data contains trade details
            } else {
                throw new Error('Failed to cancel trade.');
            }
        } catch (error) {
            toast.error('Error cancelling trade: ' + (error.response?.data?.message || error.message));
        } finally {
            setShowCancelConfirmModal(false);
            setIsCancelling(false);
        }
    };


    const handleRestartTrade = async () => {
        if (!tradeDetails || !tradeDetails.tradeId) {
            toast.error("Invalid trade details");
            return;
        }

        // Disable the button and set the "Restarting..." state
        setIsRestarting(true);

        try {
            const response = await api.patch(`/api/trade/${tradeDetails.tradeId}/restart`, {
                tradeId: tradeDetails.tradeId
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });
            if (response.status === 200) {
                toast.success('Trade restarted successfully!');
                // Update tradeDetails with new status or refetch trade details
                setTradeDetails(response.data); // Assuming you have a state named tradeDetails
            } else {
                throw new Error('Failed to restart trade.');
            }
        } catch (error) {
            toast.error('Error restarting trade: ' + (error.response?.data?.message || error.message));
        } finally {
            // Enable the button and reset the "Restarting..." state
            setIsRestarting(false);
        }
    };




    return (
        <div className="flex flex-col md:flex-row justify-center items-start my-5 mx-2 md:space-x-3 pb-20">
            <ToastContainer position="top-center" />
            {/* Transaction Container */}
            <div className="mx-3 my-5 p-4 bg-white rounded-lg border border-emerald-200 flex-1 md:max-w-2xl mb-4 md:mb-0">
                <h3 className="text-lg font-semibold mb-4">Order {tradeDetails?.tradeId} Created</h3>
                {timeLeft !== null && (
                    <div className={`countdown mb-4 p-2 rounded ${tradeDetails && tradeDetails.status === 'cancelled' ? 'bg-gray-400' : timeLeft <= 300 ? 'bg-red-500' : 'bg-emerald-100'}`}>
                        {/* If trade is cancelled, show 00:00:00, else show the time left */}
                        Pay the seller within <strong>{
                            tradeDetails && tradeDetails.status === 'cancelled' ?
                                "00:00:00" :
                                new Date(timeLeft * 1000).toISOString().substr(11, 8)
                        }</strong>
                    </div>
                )}


                {/* Step indicators */}
                <ol className="list-decimal list-inside mb-4">
                    <li>Confirm order info</li>
                    <li>Make Payment</li>
                    <li>Notify Seller</li>
                </ol>
                {/* Payment details */}
                {tradeDetails ? (

                    <div className="payment-details mb-4">
                        {/* Conditional rendering for paid status */}
                        {tradeDetails.status === 'paid' && (
                            <div className="bg-yellow-100 text-xs border-l border-yellow-500 text-yellow-700 p-4 mb-4">
                                <p className="font-bold">Awaiting Confirmation</p>
                                <p>You've Marked Trade ID: {tradeDetails.tradeId} as paid. Please await seller confirmation to proceed with the points release.</p>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span>Trade Id</span>
                            <strong>{tradeDetails.tradeId}</strong>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Price</span>
                            <strong>${tradeDetails.amount}</strong>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Receive Quantity</span>
                            <strong>{tradeDetails.points} Points</strong>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Trade Status</span>
                            <strong>{tradeDetails.status}</strong>
                        </div>
                    </div>
                ) : (
                    <p>Loading trade details...</p>
                )}
                {/* Transfer instructions */}
                <div className="mb-4">
                    <div className="mb-2">
                        <label htmlFor="accountNumber" className="text-sm font-semibold">Transfer to account:</label>
                        <input id="accountNumber" type="text" value="LT54 1300 1017 1610 831" disabled className="w-full p-2 mt-1 bg-gray-100 rounded border " />
                    </div>
                    {
                        tradeDetails && (
                            <>
                                {/* If the trade is cancelled, show a restart trade button */}
                                {tradeDetails.status === 'cancelled' && (
                                    <button
                                        onClick={handleRestartTrade}
                                        className={`w-full p-2  text-emerald-600 border border-emerald-600 rounded hover:bg-emerald-600 hover:text-white transition-colors duration-300 ${isRestarting ? 'bg-emerald-600 text-white cursor-not-allowed' : ''
                                            }`}
                                        disabled={isRestarting}
                                    >
                                        <div className="flex items-center justify-center"> {/* Added justify-center */}
                                            {isRestarting ? (
                                                <>
                                                    <FaSpinner className="animate-spin mr-2" />
                                                    Restarting...
                                                </>
                                            ) : (
                                                'Restart Trade'
                                            )}
                                        </div>
                                    </button>


                                )}

                                {/* If the trade is paid, show a button to cancel the trade */}
                                {tradeDetails.status === 'paid' && (
                                    <button
                                        className="w-full p-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors duration-300 mt-2 flex items-center justify-center"
                                        onClick={handleCancelClick}
                                    >
                                        <FaTimesCircle className="mr-2" /> Cancel
                                    </button>
                                )}

                                {/* If the trade is active or pending, show the standard Paid and Cancel buttons */}
                                {(['active', 'pending'].includes(tradeDetails.status)) && (
                                    <>
                                        <button
                                            onClick={handlePaidClick} // Show paid confirmation modal
                                            className="w-full p-2 text-emerald-600 border border-emerald-600 rounded hover:bg-emerald-600 hover:text-white transition-colors duration-300"
                                        >
                                            Paid, Notify Seller
                                        </button>
                                        <button
                                            className="w-full p-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors duration-300 mt-2 flex items-center justify-center"
                                            onClick={handleCancelClick}
                                        >
                                            <FaTimesCircle className="mr-2" /> Cancel
                                        </button>
                                    </>
                                )}
                            </>
                        )
                    }
                </div>

                {/* Paid Confirmation Modal */}
                {showPaidConfirmModal && (
                    <Modal
                        isOpen={showPaidConfirmModal}
                        onClose={() => setShowPaidConfirmModal(false)}
                        title="Paid Confirmation"
                    >
                        <div className="text-sm text-gray-500">
                            <p>Are you sure you have completed the payment? False claims can lead to account ban.</p>
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button onClick={handlePaidConfirm} className="bg-emerald-500 text-white px-4 py-2 rounded mr-4" disabled={isPaying}>
                                Yes, I've Paid
                            </button>
                            <button onClick={() => setShowPaidConfirmModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                No
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Cancel Confirmation Modal */}
                {showCancelConfirmModal && (
                    <Modal
                        isOpen={showCancelConfirmModal}
                        onClose={() => setShowCancelConfirmModal(false)}
                        title="Cancel Confirmation"
                    >
                        <div className="text-sm text-gray-500">
                            <p>Are you sure you want to cancel? If you've already paid, please do not cancel.</p>
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                onClick={handleCancelConfirm}
                                className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                                disabled={isCancelling}
                            >
                                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>

                            <button onClick={() => setShowCancelConfirmModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                No
                            </button>
                        </div>
                    </Modal>
                )}

            </div>

            <div className="mx-2 mt-5 p-2 bg-white rounded-lg border border-emerald-200 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
                <ChatWindow />
            </div>


        </div>
    );
};

export default Chat;