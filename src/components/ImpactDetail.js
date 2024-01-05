// components/ImpactDetail.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { useUser } from './context';
import { FaCamera, FaEye, FaSms, FaChevronLeft, FaChevronRight, FaTimes, FaSpinner, FaFlag, FaBan } from 'react-icons/fa';
import { Lightbox } from 'react-modal-image';
import Lottie from "lottie-react";
import unavailableAnimation from './lottie/noLinks.json';
import loadingAnimation from './lottie/loading.json';
import CommentModal from './CommentModal';


const ImpactDetail = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();
    const [impact, setImpact] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openLightbox, setOpenLightbox] = useState(false);
    const scrollRef = useRef(null);
    const [mainImageUrl, setMainImageUrl] = useState(impact?.imageUrl[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOverflow, setIsOverflow] = useState(false);
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentsData, setCommentsData] = useState([]);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportDescription, setReportDescription] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleOpenComments = () => setShowComments(true);
    const handleCloseComments = () => setShowComments(false);

    const openReportModal = () => {
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    };

    const handleDescriptionChange = (e) => {
        let newDescription = e.target.value;

        // Truncate the input if it exceeds 200 characters
        if (newDescription.length > 200) {
            newDescription = newDescription.substring(0, 200);
        }

        setReportDescription(newDescription);

        // Update character count
        setWordCount(newDescription.length);
    };


    useEffect(() => {
        if (!showComments) return;

        const fetchComments = async () => {
            setIsLoadingComments(true);
            try {
                const headers = {};
                if (user && user.token) {
                    headers['Authorization'] = `Bearer ${user.token}`;
                }

                const response = await api.get(`/api/impacts/${impact?._id}/comments`, { headers });
                console.log("Fetched comments:", response.data);
                setCommentsData(response.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchComments();
    }, [showComments, impact?._id]);

    // Fetching impact details from the API
    useEffect(() => {
        const fetchImpactDetail = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/impacts/${id}`);
                setImpact(response.data); // Assume the API returns the impact data
            } catch (error) {
                console.error("Error fetching impact details:", error);
                // Handle error appropriately
            } finally {
                setIsLoading(false);
            }
        };

        fetchImpactDetail();
    }, [id]);

    useEffect(() => {
        if (impact && impact.imageUrl && impact.imageUrl.length > 0) {
            const imgElement = new Image();
            imgElement.src = impact.imageUrl[0];
            imgElement.onload = () => {
                setMainImageUrl(imgElement.src);
            };
        }
    }, [impact]);

    // Set isOverflow for thumbnail strip
    useEffect(() => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            setIsOverflow(scrollWidth > clientWidth);
        }
    }, [impact?.images]);

    const handleThumbnailHover = (url) => {
        const index = impact?.imageUrl.indexOf(url);
        if (index >= 0) {
            setCurrentIndex(index); // Update the current index
            setMainImageUrl(url);
        }
    };

    // Scroll handler for the thumbnail strip
    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            if (direction === 'left') {
                current.scrollLeft -= 50;
            } else {
                current.scrollLeft += 50;
            }
        }
    };


    const handleShareClick = async () => {
        const url = `https://brevyn.vercel.app/impact/${id}`; // Construct the URL to be shared

        if (navigator.share) {
            // Use the Web Share API
            try {
                await navigator.share({
                    title: impact.title,  // Ensure you have the impact title available
                    text: "Check out this impact!", // Custom text for the share
                    url: url,
                });
                console.log("Impact shared successfully");
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            // For example, copy the link to the clipboard
            navigator.clipboard.writeText(url).then(() => {
                console.log("Link copied to clipboard");
                // Display a message or toast notification to the user
            }, (err) => {
                console.error('Could not copy link: ', err);
            });
        }
    };

    const handleReportAbuse = async () => {
        setIsSubmitting(true); // Start submitting
        try {
            const response = await api.post('/api/abuse/report-abuse', {
                impactId: impact._id,
                reportContent: reportDescription
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // Handle success
            setReportDescription(''); // Reset report description
            toast.success("Report submitted successfully!"); // Success toast
            console.log("Report submitted successfully: ", response.data);
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Error submitting report!"+ (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false); // End submitting
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen overflow-hidden">
                <div>
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            </div>
        );
    }

    if (!impact) {
        return (
            <div className="flex justify-center items-center h-screen overflow-hidden">
                <div>
                    <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                </div>
            </div>
        );
    }



    return (
        <>
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-md">
                {/* Impact Image Gallery */}
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        {/* Main Impact Image Container */}
                        <div className="relative mb-4 cursor-pointer" onClick={() => setOpenLightbox(true)}>
                            {/* Overlay for image count */}
                            <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full flex items-center z-10">
                                <FaCamera className="text-lg" />
                                <span className="text-sm ml-1">{`${currentIndex + 1}/${impact.imageUrl.length}`}</span>
                            </div>
                            {/* Overlay for views count */}
                            <div className="absolute bottom-0 right-0 m-2 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full flex items-center z-10">
                                <FaEye className="text-lg" />
                                <span className="text-sm ml-1">{impact.views}</span>
                            </div>
                            <div className="relative w-full" style={{ maxHeight: '300px', overflow: 'hidden' }}>
                                <img
                                    src={mainImageUrl}
                                    alt="Main Image"
                                    className="rounded-md w-full object-cover"
                                    style={{ maxHeight: '300px' }} // Ensuring the image never exceeds this height
                                />
                            </div>
                        </div>
                        {openLightbox && (
                            <Lightbox mainSrc={mainImageUrl} onCloseRequest={() => setOpenLightbox(false)} />
                        )}

                        {/* Thumbnail Strip */}
                        <div className="relative flex items-center mb-4 lg:max-w-lg lg:w-full">
                            {isOverflow && (
                                <button onClick={() => handleScroll('left')} className="absolute left-0 z-10 bg-white bg-opacity-50 rounded-full p-1">
                                    <FaChevronLeft />
                                </button>
                            )}
                            <div className="flex overflow-x-auto" ref={scrollRef}>
                                {impact?.imageUrl.map((url, index) => (
                                    <div key={index} className="flex-shrink-0 mr-2" style={{ width: '50px', height: '50px', position: 'relative' }}>
                                        <img
                                            src={url}
                                            alt={`Thumbnail ${index + 1}`}
                                            layout="fill"
                                            className="rounded-md"
                                            onMouseEnter={() => handleThumbnailHover(url)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {isOverflow && (
                                <button
                                    onClick={() => handleScroll('right')}
                                    className="absolute right-0 z-10 bg-white bg-opacity-50 rounded-full p-1"
                                    aria-label="Scroll right"
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>

                        {/* Impact Title and Description */}
                        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-emerald-700">{impact.title}</h1>
                        <p className="text-sm sm:text-gray-600 mb-4">{impact.description}</p>

                        {/* Impact Details Section */}
                        <div className="bg-gray-100 p-4 rounded-md shadow-inner">
                            <h2 className="text-base sm:text-lg font-semibold mb-2 text-emerald-600">Impact Details</h2>
                            <ul className="list-disc pl-5 text-xs sm:text-sm">
                                {/* List specific details about the impact here */}
                                <li>Objective: {impact.objective}</li>
                                <li>Area: {impact.area}</li>
                                {/* More impact details */}
                            </ul>
                        </div>
                    </div>

                    {/* Impact Details */}
                    <div className="md:flex-1 px-4 mt-4 sm:mt-0">
                        <div className="bg-gray-100 p-4 sm:p-6 rounded-md shadow-md w-full max-w-md mx-auto">
                            {/* Impact Engagement Section */}
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Engage with this Impact</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Learn how you can make a difference</p>
                                <button
                                    className="mt-3 mb-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-md w-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Get Involved
                                </button>
                            </div>

                            {/* Impact Feedback Section */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm mt-4">
                                <div className="flex items-center">
                                    <div className="p-2 mr-2 bg-[#D9F9E5] rounded-full">
                                        <FaSms className="text-[#34D399]" />
                                    </div>
                                    <span className="text-gray-800 text-xs sm:text-sm font-medium">Community Feedback</span>
                                </div>
                                <button onClick={handleOpenComments}
                                    className="text-[#34D399] text-xs sm:text-sm font-medium hover:underline">
                                    view all
                                </button>
                            </div>

                            {/* Safety Tips or Guidelines Section */}
                            <div className="mt-3 bg-white p-4 rounded-md shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Guidelines for Engagement</h3>
                                <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-600 mt-2">
                                    {/* List of guidelines or tips for safely engaging with the impact */}
                                    <li>Ensure all contributions are directed through official channels.</li>
                                    <li>Verify the authenticity of the impact before getting involved.</li>
                                    {/* More guidelines or tips */}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="bg-white p-4 rounded-md shadow-sm mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
                                <button
                                    className="flex items-center justify-center border border-gray-300 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md transition duration-300 focus:outline-none w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
                                    onClick={handleShareClick}
                                >
                                    <FaFlag className="mr-2" />
                                    Share This Impact
                                </button>
                                <button
                                    className="flex items-center justify-center border border-gray-300 text-red-600 hover:bg-red-50 py-2 px-4 rounded-md transition duration-300 focus:outline-none w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
                                    onClick={openReportModal}
                                >
                                    <FaBan className="mr-2" />
                                    Report a Concern
                                </button>
                            </div>
                            {isReportModalOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <ToastContainer position="top-center" />
                                    <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg shadow-lg">
                                        {/* Modal Header */}
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold">Report Abuse</h2>
                                            <div
                                                className="rounded-full p-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                                                onClick={closeReportModal}
                                            >
                                                <FaTimes className="text-red-500" />
                                            </div>
                                        </div>

                                        {/* Report Form */}
                                        <div className="mt-4">
                                            <textarea
                                                className="w-full text-xs p-2 border border-green-300 rounded-md focus:outline-none focus:border-green-500 focus:ring focus:ring-green-300"
                                                rows="4"
                                                placeholder="Describe the issue"
                                                value={reportDescription}
                                                onChange={handleDescriptionChange}
                                            ></textarea>

                                            <div id="wordCounter" className="text-right text-xs">{wordCount}/200</div>
                                            <button
                                                onClick={handleReportAbuse}
                                                disabled={isSubmitting} // Disable button when submitting
                                                className="mt-4 bg-red-500 text-xs text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 flex items-center justify-center"
                                            >
                                                {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null} {/* Spinner icon */}
                                                {isSubmitting ? "Reporting..." : "Submit Report"} {/* Button text */}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>
            {/* Conditional rendering of CommentModal */}
            {showComments && (
                <CommentModal
                    onClose={handleCloseComments}
                    comments={commentsData}
                    impactId={id}
                    impactTitle={impact ? impact.title : ''}
                    isLoading={isLoadingComments}
                />
            )}
        </>
    );
};

export default ImpactDetail;