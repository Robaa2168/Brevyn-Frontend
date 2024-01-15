import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/api/reviews');
                setReviews(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-8 py-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-4">Reviews List</h1>
          <ul>
            {reviews.map((review) => (
              <li key={review._id} className="mb-6 border border-gray-300 rounded p-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold">{`${review.firstName} ${review.lastName}`}</span>
                    <p className="text-gray-700">{review.reviewContent}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                    <span className="text-emerald-600 font-semibold">
                      Rating: {review.rating} / 5
                    </span>
                    <span className="text-gray-500">
                      Created At: {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <Link to={`/edit-review/${review._id}`} className="text-emerald-600 hover:text-emerald-800 flex items-center">
                      <FaEdit className="w-5 h-5" />
                      <span className="ml-2">Edit</span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
      
    
};

export default ReviewList;
