import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../api';
import { useUser } from '../context';

const PostFaq = () => {
    const { user } = useUser();
    const [faqDetails, setFaqDetails] = useState({
        question: '',
        answer: '',
        category: 'Transaction' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // New state for success message

    const handleChange = (e) => {
        if (e.target) {
            // Standard inputs
            setFaqDetails({ ...faqDetails, [e.target.name]: e.target.value });
        } else {
            setFaqDetails({ ...faqDetails, answer: e });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/api/faqs/faq', faqDetails, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.status === 201) {
                setSuccess("FAQ posted successfully!"); // Update success message
                setFaqDetails({ question: '', answer: '' }); // Clear form fields
            } else {
                setError("Failed to post FAQ. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while posting the FAQ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Post a New FAQ</h2>

            {error && (
                <div className="mb-4 p-4 text-sm bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 text-sm bg-green-100 border-l-4 border-green-500 text-green-700">
                    <p>{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

            <div className="mb-4">
                    <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={faqDetails.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="Impact">Impact</option>
                        <option value="Transaction">Transaction</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="question" className="block mb-1 text-sm font-medium text-gray-700">Question</label>
                    <input
                        type="text"
                        name="question"
                        value={faqDetails.question}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter the FAQ question"
                    />
                </div>


                <div className="mb-4">
                    <label htmlFor="answer" className="block mb-1 text-sm font-medium text-gray-700">Answer</label>
                    <ReactQuill
                        value={faqDetails.answer}
                        onChange={handleChange}
                        style={{ height: '200px' }} // Inline style for height
                        className="w-full border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>


                <div className="col-span-1">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex justify-center items-center w-full text-white py-2 px-4 rounded transition duration-300 ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                    >
                        {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
                        Post FAQ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostFaq;
