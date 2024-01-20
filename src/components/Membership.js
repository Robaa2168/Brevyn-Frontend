// Membership.js
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { useUser } from "./context";

const Membership = () => {
    
    const { user, login } = useUser();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); 
    const [visibleBenefit, setVisibleBenefit] = useState(null);
    const navigate = useNavigate();

    const premiumBenefits = [
        { 
            title: "Unlimited Donation Links", 
            description: "Create as many donation links as you need to support various causes and initiatives." 
        },
        { 
            title: "Instant Withdrawals", 
            description: "Get immediate access to your funds with our expedited withdrawal process." 
        },
        { 
            title: "Unlimited Volunteer Programs", 
            description: "Join or organize an unlimited number of volunteer programs to expand your social impact." 
        },
        { 
            title: "Exclusive Grant Applications", 
            description: "Gain eligibility to apply for special grants exclusively available to premium members." 
        },
        { 
            title: "Advanced Analytics", 
            description: "Access detailed reports and analytics to track and optimize your fundraising efforts." 
        },
        { 
            title: "Priority Support", 
            description: "Receive priority customer service with faster response times and dedicated support." 
        },
        { 
            title: "Networking Opportunities", 
            description: "Connect with a network of like-minded individuals and organizations for collaboration and support." 
        },
        { 
            title: "Customizable Fundraising Pages", 
            description: "Personalize your fundraising pages with advanced customization options for greater impact." 
        },
        { 
            title: "Promotional Features", 
            description: "Get your campaigns and programs featured in our promotional channels for increased visibility." 
        },
        { 
            title: "Educational Resources", 
            description: "Access exclusive webinars, tutorials, and guides to enhance your fundraising skills." 
        },
        { 
            title: "Event Invitations", 
            description: "Receive invitations to exclusive events and conferences for networking and learning." 
        },
        { 
            title: "Recognition and Awards", 
            description: "Become eligible for member recognition awards and certificates to showcase your achievements." 
        }
    ];
    


    useEffect(() => {
        if (!user || !user.token) {
          navigate('/login');
        }
      }, [user]);

  
      // Function to toggle benefit visibility
      const toggleBenefit = (benefit) => {
          setVisibleBenefit(visibleBenefit === benefit ? null : benefit);
      };
      

    const handleUpgrade = async () => {
        setIsUpgrading(true);

        try {
            const response = await api.patch('/api/auth/upgrade-membership', {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Membership upgraded to Premium successfully!");
                login({ ...user, isPremium: true });
                setShowConfetti(true); // Show confetti on successful upgrade
                setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
            } else {
                toast.error("Failed to upgrade membership.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during the upgrade.");
        } finally {
            setIsUpgrading(false);
        }
    };


    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
            <ToastContainer position="top-center" />
            {showConfetti && <Confetti />}
            <h2 className="text-lg font-bold mb-4">Membership</h2>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4">
                {/* Free Tier Card */}
                <div className="border rounded-lg p-6 flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="text-md font-extrabold mb-4 text-center">Free Tier</h3>
                        <p className="text-green-500 text-xl font-bold mb-4 text-center">Free</p>
                        <ul className="text-xs mb-6 text-center">
                            <li>Participate in 1 volunteer program</li>
                            <li>Create 1 donation link</li>
                            <li>No access to grants</li>
                        </ul>
                    </div>
                    <button className="bg-gray-300 text-gray-700 text-xs py-2 px-4 rounded hover:bg-gray-400 transition duration-300 w-full mt-4">
                        Stay on Free
                    </button>
                </div>

                {/* Premium Tier Card */}
                <div className="border rounded-lg p-6 flex flex-col justify-between  flex-1">
                    <div>
                        <h3 className="text-md font-extrabold mb-4 text-center">Premium Tier</h3>
                        <p className="text-green-500 text-xl font-bold mb-4 text-center">50 Points/year</p>
                        <ul className="text-xs mb-6 text-center">
    {premiumBenefits.map((benefit, index) => (
        <li 
            key={index} 
            className="cursor-pointer mb-3 last:mb-0" 
            onClick={() => toggleBenefit(benefit.title)}
        >
            <strong>{benefit.title}</strong>
            <span className="inline-block ml-2">
                {visibleBenefit === benefit.title ? <FaChevronUp /> : <FaChevronDown />}
            </span>
            {visibleBenefit === benefit.title && <p className="mt-2">{benefit.description}</p>}
        </li>
    ))}
</ul>

                    </div>
                    <button
                        onClick={handleUpgrade}
                        disabled={isUpgrading || user.isPremium}
                        className={`w-full text-xs py-2 px-4 rounded transition duration-300 ${user.isPremium ? "bg-gray-400" : isUpgrading ? "bg-emerald-300" : "bg-emerald-500 hover:bg-emerald-600"} text-white`}>
                        {isUpgrading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 inline" />
                                Upgrading...
                            </>
                        ) : user.isPremium ? (
                            "Upgraded"
                        ) : (
                            "Upgrade to Premium"
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Membership;
