// components/Impact.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiBarChart } from 'react-icons/fi';
import { IoHeartOutline } from 'react-icons/io5';
import api from '../api';
import { useUser } from './context';
import CommentModal from './CommentModal';


function Impact({ _id, imageUrl, title, description, impressions, likes, comments, commentCount, userHasLiked }) {
    const { user } = useUser();
    const navigate = useNavigate();
    const [likesCount, setLikesCount] = useState(likes);
    const [hasLiked, setHasLiked] = useState(userHasLiked);
    const [impressionCount, setImpressionCount] = useState(impressions);
    const [showComments, setShowComments] = useState(false);
    const [commentsData, setCommentsData] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);


    const goToImpactDetail = () => {
        navigate(`/impact/${_id}`); // assuming /impact/:id is the route for individual impacts
    };


    // Function to open modal
    const handleOpenComments = () => {
        setShowComments(true);
    };

    // Function to close modal
    const handleCloseComments = () => {
        setShowComments(false);
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

                const response = await api.get(`/api/impacts/${_id}/comments`, { headers });
                console.log("Fetched comments:", response.data);
                setCommentsData(response.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchComments();
    }, [showComments, _id]);


    const handleLike = async () => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        // Optimistically update the UI
        const newLikeStatus = !hasLiked;
        setHasLiked(newLikeStatus);
        setLikesCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));

        try {
            // Make API call to toggle the like status
            const response = await api.patch(`/api/impacts/${_id}/likes`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // Update state based on the server's response
            setLikesCount(response.data.likes);
            setHasLiked(response.data.userHasLiked);
        } catch (error) {
            console.error("Error toggling like: ", error);
            // Revert to the previous state if there's an error
            setHasLiked(!newLikeStatus);
            setLikesCount((prev) => (!newLikeStatus ? prev + 1 : prev - 1));
        }
    };


    const handleimpressionCount = () => {
        // Implement comment functionality here
        setImpressionCount(prevCommentCount => prevCommentCount + 1);
    };
    return (
        <div className="flex flex-col border-2 border-emerald-200 rounded-lg overflow-hidden shadow-md relative group h-full">
    {imageUrl && (
        <img
            src={imageUrl}
            alt={`${title}`}
            className="object-cover w-full h-64"
            onClick={goToImpactDetail}
        />
    )}
    <div className="p-2 flex flex-col justify-between h-full"> 
        <h3 className="font-semibold text-lg mb-0 truncate" onClick={goToImpactDetail}>{title}</h3>
        <p className="text-gray-600 mb-1 truncate border-b border-dotted border-emerald-200 pb-1">{description}</p>

        <div className="flex space-x-4 justify-end"> 
            <button className="flex items-center space-x-1" onClick={handleLike} aria-label="Like">
                {hasLiked ? <FiHeart className="text-red-500" /> : <IoHeartOutline className="text-gray-500" />}
                <span>{likesCount}</span>
            </button>

            <button className="flex items-center space-x-1" onClick={handleOpenComments} aria-label="Comments">
                <FiMessageCircle className="text-gray-500" />
                <span>{commentCount}</span>
            </button>

            <button
                onClick={handleimpressionCount}
                className="flex items-center space-x-1"
                aria-label="Impressions"
                style={{ outline: 'none' }}
            >
                <FiBarChart className="text-gray-500 cursor-pointer" />
                <span className="text-xs sm:text-sm">{impressionCount}</span>
            </button>
        </div>
        {showComments && (
            <CommentModal
                onClose={handleCloseComments}
                impactId={_id}
                comments={commentsData}
                impactTitle={title}
                isLoading={isLoadingComments}
            />
        )}
    </div>
</div>

    );
}

export default Impact;
