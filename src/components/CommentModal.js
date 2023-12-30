// components/CommentModal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FaSpinner, FaHeart } from 'react-icons/fa';
import api from '../api'; // Ensure API is set up to handle requests
import { useUser } from "./context";
import { formatDistanceToNow } from 'date-fns';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';



const CommentModal = ({ onClose, comments, impactId, impactTitle, isLoading }) => {
    const navigate = useNavigate(); // Hook for navigation
    const { user } = useUser();
    const [commentsData, setCommentsData] = useState(comments || []);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        setCommentsData(comments);
    }, [comments]);
    // Handlers for changing and submitting new comments
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (!user || !user.token) {
            navigate('/login'); // Redirect to login if user isn't authenticated
            return;
        }

        if (!newComment.trim()) return; // Prevent empty comments
        setIsSubmitting(true); // Start submission process

        try {
            const response = await api.post(`/api/impacts/${impactId}/comments`, { text: newComment }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            // Append the new comment to the local state
            setCommentsData([...commentsData, response.data]); // Append new comment
            setNewComment(""); // Clear the comment input field
        } catch (error) {
            console.error("Error submitting comment:", error);
            // Optionally handle the error (e.g., set an error state, show a message, etc.)
        } finally {
            setIsSubmitting(false); // End submission process
        }
    };
    const handleReaction = async (commentId) => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        // Optimistically update UI for immediate feedback
        const optimisticUpdatedComments = commentsData.map(comment => {
            if (comment._id === commentId) {
                const isLiked = comment.likedByCurrentUser;
                return {
                    ...comment,
                    likes: isLiked ? comment.likes - 1 : comment.likes + 1, // Adjust likes count
                    likedByCurrentUser: !isLiked, // Toggle liked status
                };
            }
            return comment;
        });

        setCommentsData(optimisticUpdatedComments);

        try {
            // Make API call to toggle the like status
            const response = await api.patch(`/api/comments/${commentId}/likes`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // Update comment data with response from the server
            setCommentsData(optimisticUpdatedComments.map(comment => {
                if (comment._id === commentId) {
                    // Ensure we use the server's response to set the final state
                    return {
                        ...comment,
                        likes: response.data.likes, // Use server's likes count
                        likedByCurrentUser: response.data.userHasLiked, // Use server's liked status
                    };
                }
                return comment;
            }));
        } catch (error) {
            console.error("Error toggling like for comment: ", error);
            // Revert optimistic update if necessary by restoring the previous state
            setCommentsData(optimisticUpdatedComments); // revert back to what was before the optimistic update
        }
    };



    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center ">


                {/* Modal panel, might add transition effects */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full h-3/4">
                    {/* Modal Header */}
                    <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">{`Comments for ${impactTitle}`}</span>
                        <button onClick={onClose} className="text-gray-700 hover:text-emerald-600 transition duration-150 focus:outline-none">
                            &times;
                        </button>
                    </div>
                    {/* New Section: Respectful Interaction Reminder */}
                    <div className="bg-gray-100  p-3" role="alert">
                        <div className="flex items-center">
                            {/* Icon */}
                            <div className="py-1">
                                <svg className="fill-current h-6 w-6 text-gray-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110-2 1 1 0 010 2zm0-3a1 1 0 01-1-1V7a1 1 0 112 0v3a1 1 0 01-1 1z" />
                                </svg>
                            </div>
                            {/* Message */}
                            <div>
                                <p className="text-sm text-gray-700">
                                    Healthy and constructive discussions leads to a better community for everyone.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Comments List */}
                    <div className="px-4 py-3 overflow-y-auto ">


                        {/* Loading Spinner */}
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <FaSpinner className="animate-spin" size={20} />
                            </div>
                        ) : comments.length > 0 ? (

                            commentsData.map((comment) => (
                                <div key={comment._id} className="mb-3 border-b border-gray-200 pb-2">
                                    {/* Comment Content */}
                                    <div className="flex space-x-2">
                                        {/* User Avatar */}
                                        <div className="flex-none">
                                            <img className="h-8 w-8 rounded-full" src={comment.user.profileImage} alt={`${comment.user.firstName} avatar`} />
                                        </div>

                                        {/* Comment Text and Metadata */}
                                        <div className="flex-grow text-xs sm:text-sm space-y-1">
                                            {/* Name and Text */}
                                            <div>
                                                <span className="font-semibold">{comment.user.firstName || comment.user.username}</span>
                                                <p className="text-gray-800">{comment.text}</p>
                                            </div>

                                            {/* Time Ago */}
                                            <div className="text-gray-500">
                                                {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                                            </div>
                                        </div>

                                        {/* Like Button and Count */}
                                        <div className="flex-none text-right space-y-1">
                                            <button
                                                onClick={() => handleReaction(comment._id)}
                                                className={`text-gray-500 ${comment.likedByCurrentUser ? 'text-red-600' : 'hover:text-red-600'}`}>
                                                <FaHeart size={14} />
                                            </button>
                                            <div className="text-gray-500 ml-2">{comment.likes}</div>
                                        </div>
                                    </div>
                                </div>
                            ))


                        ) : (
                            <p className="text-center text-gray-500">No comments yet.</p>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <FaPaperclip className="text-gray-500 cursor-pointer hidden sm:block" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                        />
                        <button
                            type="submit"
                            onClick={handleCommentSubmit}
                            className="bg-emerald-500 text-white p-2 rounded-lg focus:outline-none hover:bg-emerald-600"
                            disabled={isSubmitting} // Disable the button while submitting
                        >
                            {isSubmitting ? (
                                <FaSpinner className="animate-spin text-sm sm:text-base" />
                            ) : (
                                <FaPaperPlane className="text-sm sm:text-base" />
                            )}
                        </button>

                    </div>


                </div>
            </div>
        </div>
    );
};

export default CommentModal;